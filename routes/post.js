const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const { user, post } = new PrismaClient();

router.post("/", async (req, res) => {
  const { title, content, user_id } = req.body;

  const userExists = await user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!userExists) {
    return res.status(404).json({ error: "No such user exists" });
  }

  const newPost = await post.create({
    data: {
      title,
      post: content,
      user_id,
    },
  });

  res.json(newPost);
});

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const posts = await post.findMany({
    where: {
      user_id: parseInt(user_id), // always parse to int the id else it won't be able to query
    },
    select: {
      title: true,
      created_at: true,
      post: true,
      user: {
        //   Nested select
        select: {
          username: true,
        },
      },
    },
  });

  res.json(posts);
});

module.exports = router;
