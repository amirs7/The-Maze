const User = require('./data_access/models/user');
const Maze = require('./data_access/models/maze');

async function setup(){
  let user = new User({
    _id: process.env.ADMIN_USERNAME,
    name: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASS,
    role: 'admin'
  });
  let maze;
  maze = await Maze.findOne({});
  if(!maze)
    maze = new Maze();
  maze.save().then(() => {
    user.save().then(() => {
      console.log('done');
    });
  });
};