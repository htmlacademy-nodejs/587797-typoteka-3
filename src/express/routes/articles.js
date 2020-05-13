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
    cb(null, `${file.fieldname}-${Date.now()}.${mime.getExtension(file.mimetype)}`);
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
    let newFileName = null;
    let newFilePath = null;

    try {
      if (req.locals && req.locals.fileError) {
        throw req.locals.fileError;
      }

      if (req.file !== undefined) {
        logger.debug({message: `Got file`, content: req.file});

        if (req.file.size === 0) {
          throw new InvalidFormException(`Empty file. Size ${req.file.size}`);
        }

        newFileName = req.file.filename;
        newFilePath = req.file.path;
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
      fs.access(newFilePath, async (error) => {
        if (!error) {
          await fs.unlink(newFilePath, (fileError) => {
            if (fileError) {
              logger.error(`Can't delete file ${newFilePath}, error: ${fileError}`);

              return;
            }

            logger.info(`File ${newFilePath} successfully deleted`);
          });
        }
      });

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
