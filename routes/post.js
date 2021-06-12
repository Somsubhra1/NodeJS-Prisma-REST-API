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

module.exports = router;
