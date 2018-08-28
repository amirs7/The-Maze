const User = require('./data_access/models/user');
let user = new User({
  _id: process.env.ADMIN_USERNAME,
  name: process.env.ADMIN_NAME,
  password: process.env.ADMIN_PASS,
  role: 'admin'
});

const Maze = require('./data_access/models/maze');
let maze;
maze = Maze.findOne({});
if(!maze)
  maze = new Maze();
maze.save().then(() => {
  user.save().then(() => {
    console.log('done');
  });
});