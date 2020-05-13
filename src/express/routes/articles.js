'use strict';

const fs = require(`fs`);
const axios = require(`axios`);
const path = require(`path`);
const {getLogger} = require(`../libs/logger`);
const logger = getLogger();
const multer = require(`multer`);
const mime = require(`mime/lite`);

const InvalidFormException = require(`../exceptions/invalid-form`);

const {
  BASE_API_URL,
  HttpCode
} = require(`../../constants`);

const {
  ARTICLES_PICTURES_DIR
} = require(`../constants`);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, ARTICLES_PICTURES_DIR);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (![`image/jpeg`, `image/png`, `image/webp`].includes(file.mimetype)) {
      req.locals = {}; // @todo это норм?
      req.locals.fileError = new InvalidFormException(`Bad file extension provided`);
      cb(null, false);
    } else {
      cb(null, true);
    }
  }
});

const {Router} = require(`express`);

const articlesRouter = new Router();

articlesRouter
  .get(`/add`, (req, res) => {
    res.render(`articles/new-post`, {
      title: `post-page`,
      user: {
        role: `author`
      },
      article: {}
    });
  })
  .post(`/add`, upload.single(`picture`), async (req, res, next) => {
    try {
      if (req.locals && req.locals.fileError) {
        throw req.locals.fileError;
      }

      if (req.body === undefined) {
        throw new Error(`Can't find body`);
      }

      logger.debug({message: `Got body`, content: req.body});

      const keysFromForm = Object.keys(req.body);

      const requiredFields = [`title`, `announce`, `created`];

      const areAllRequiredFieldsExist = requiredFields.every((requiredField) => keysFromForm.includes(requiredField));

      if (!areAllRequiredFieldsExist) {
        throw new InvalidFormException(`Not all required fields are presented. Fields from form: ${keysFromForm.toString()}.
        Required fields: ${requiredFields.toString()}`);
      }

      logger.debug(`Form fields are valid`);

      let newFileName = null;
      let newFilePath = null;

      if (req.file !== undefined) {
        logger.debug({message: `Got file`, content: req.file});

        const {
          mimetype: mimeType,
          size,
          path: filePath,
          originalname: originalName,
          filename: generatedName
        } = req.file;

        if (size === 0) {
          throw new InvalidFormException(`Empty file. Size ${size}`);
        }

        newFileName = `${generatedName}.${mime.getExtension(mimeType)}`;
        newFilePath = path.resolve(ARTICLES_PICTURES_DIR, newFileName);

        await fs.promises.rename(filePath, newFilePath);
        logger.info(`File successfully renamed. Original filename: ${originalName}, generated filename: ${newFileName}`);
      }

      logger.info(`Form is valid. Send post request to record data`);

      const postResponse = await axios
        .post(`${BASE_API_URL}/articles`, Object.assign({}, req.body, {picture: newFileName}));

      logger.info(`Response status is ${postResponse.status}`);

      if (postResponse.status === HttpCode.SUCCESS_POST) {
        res.redirect(`/my`);
      } else {
        next(new Error(`Invalid response status code: ${postResponse.status}`));
      }
    } catch (caughtError) {
      if (caughtError instanceof InvalidFormException) {
        logger.error(caughtError);

        res.render(`articles/new-post`, {
          title: `post-page`,
          user: {
            role: `author`
          },
          article: req.body
        });

        return;
      }

      if (caughtError.response) {
        logger.error(`Post error: ${caughtError.response.data}`);
      }

      next(caughtError);
    }
  });
articlesRouter.get(`/category/:id`, (req, res) => {
  res.render(`articles/articles-by-category`, {
    activeCategory: 3,
    categories: [
      {
        id: 1,
        title: `Автомобили`,
        count: 88
      },
      {
        id: 2,
        title: `Удаленная работа`,
        count: 13
      },
      {
        id: 3,
        title: `Бизнес`,
        count: 13
      },
      {
        id: 4,
        title: `Путешествия`,
        count: 13
      },
      {
        id: 5,
        title: `Дизайн и обустройство`,
        count: 13
      },
      {
        id: 6,
        title: `Производство игрушек`,
        count: 22
      },
      {
        id: 7,
        title: `UX & UI`,
        count: 22
      }
    ]
  });
});
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const response = await axios.get(`${BASE_API_URL}/articles/${req.params.id}`);
  res.render(`articles/edit-post`, {
    title: `post-page`,
    user: {},
    comments: [],
    article: response.data
  });
});
articlesRouter.get(`/:id`, (req, res) => {
  res.render(`articles/post`, {
    title: `post-page`,
    user: {},
    comments: [],
    post: {
      image: `1`
    }
  });
});

module.exports = articlesRouter;
