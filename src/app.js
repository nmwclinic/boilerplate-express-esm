import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
// import indexRouter from '@routes/index';
// import usersRouter from '@routes/users';
import { processCSS } from './middlewares/postcss.js'
import vine from '@vinejs/vine'

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('views', path.resolve('views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/css/:file', async (req, res) => {
  try {
    const fileName = req.params.file;
    // const filePath = path.join(__dirname, '../public/css', fileName);
    const filePath = path.resolve('public', 'css', fileName);

    const css = await processCSS(filePath);
    res.set('Content-Type', 'text/css');
    res.send(css);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', async (req, res) => {
  try {
    const schema = vine.object({
      username: vine.string(),
      email: vine.string().email(),
      password: vine
        .string()
        .minLength(8)
        .maxLength(32)
        .confirmed()
    })
    
    const data = {
      username: 'virk',
      email: 'virk@example.com',
      password: 'secret',
      password_confirmation: 'secret',
    }
    
    const output = await vine.validate({
      schema,
      data
    })
    
    

    res.set('Content-Type', 'text/css');
    res.send('');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.resolve('public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Not found" });
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
