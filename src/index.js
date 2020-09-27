const express = require("express");
require("./db/moongose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is running on port:" + port);
});

// app.post("/users", (req, res) => {
//   const user = new User(req.body);
//   user
//     .save()
//     .then(() => {
//       res.status(201).send(user);
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// });

// app.get("/users", (req, res) => {
//   User.find({})
//     .then((users) => {
//       res.send(users);
//     })
//     .catch((err) => {
//       res.status(500).send();
//     });
// });

// app.get("/users/:id", (req, res) => {
//   const _id = req.params.id;
//   User.findById(_id)
//     .then((user) => {
//       if (!user) {
//         res.status(404).send();
//       }
//       res.send(user);
//     })
//     .catch((err) => res.status(500).send(err));
// });

// app.post("/tasks", (req, res) => {
//   const task = new Task(req.body);
//   task
//     .save()
//     .then(() => {
//       res.status(201).send(task);
//     })
//     .catch((err) => res.status(400).send(err));
// });

// app.get("/tasks", (req, res) => {
//   Task.find()
//     .then((tasks) => res.send(tasks))
//     .catch(() => res.status(500).send());
// });

// app.get("/tasks/:id", (req, res) => {
//   const _id = req.params.id;

//   Task.findById(_id)
//     .then((task) => {
//       if (!task) {
//         res.status(404).send();
//       }
//       res.send(task);
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });
