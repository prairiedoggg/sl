const router = require("express").Router();
const {
  User2,
  Education,
  Certificate,
  Award,
  Portfolio,
} = require("../models/newUser.js");
const mongoose = require("mongoose");

//전체 유저조회
router.get("/users", async (req, res) => {
  const users = await User2.find({}).select("-password");
  console.log("🚀 ~ router.get ~ users:", users);
  res.json(users);
});

//개인 페이지
router.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  const user = await User2.findOne({
    username,
  })
    .select("-password")
    .populate("education");
  res.json(user);
});

//개인 학력 조회
router.get("/users/:username/education", async (req, res) => {
  const username = req.params.username;
  let putUser;

  try {
    putUser = await User2.findOne({
      username,
    }).populate("education");

    if (!putUser) {
      return res.status(404).send({
        Message: "User not found",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      Message: "Internal Server Error",
    });
  }

  res.json(putUser); // 이제 putUser는 정의되었습니다.
});

//개인 페이지 추가 (학력)
router.post("/users/:username/education", async (req, res) => {
  const username = req.params.username;
  const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;
  const user = await User2.findOne({
    username,
  }).select("-password");
  const putUser = await Education.create({
    user: user._id,

    schoolName,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
  });
  user.education.push(putUser._id);
  await user.save();
  res.json(putUser);
});

//개인 페이지 수정
router.patch("/users/:username/education/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const { schoolName, degree, fieldOfStudy, startDate, endDate } = req.body;
  const user = await User2.findOne({
    username,
  }).select("-password");

  const patchUser = await Education.updateOne(
    {
      user: user._id,
      _id,
    },
    {
      $set: {
        schoolName,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
      },
    }
  );
  user.education.push(patchUser._id);
  await user.save();
  res.json(patchUser);
});

//개인 페이지 삭제
router.delete("/users/:username/education/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const updateUser = await User2.updateOne(
    {
      username: username,
    },
    {
      $pull: {
        education: _id,
      },
    }
  );
  res.json(updateUser);
});

// 자격증 정보 추가
router.post("/users/:username/certificate", async (req, res) => {
  try {
    const username = req.params.username;
    const { name, issuingOrganization, issueDate } = req.body;

    const user = await User2.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const putUser = await Certificate.create({
      user: user._id,
      name,
      issuingOrganization,
      issueDate,
    });

    user.certificate.push(putUser._id);
    await user.save();

    res.status(201).json(putUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러가 발생했습니다." });
  }
});

// 자격증 정보 조회
router.get("/users/:username/certificate", async (req, res) => {
  const username = req.params.username;
  const user = await User2.findOne({ username }).populate("certificate");
  res.json(user.certificate);
});

// 자격증 정보 수정
router.patch("/users/:username/certificate/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const { name, issuingOrganization, issueDate } = req.body;
  const user = await User2.findOne({ username }).select("-password");

  await Certificate.updateOne(
    { _id },
    { $set: { name, issuingOrganization, issueDate } }
  );
  res.json({ message: "자격증 정보 수정 완료" });
});

// 자격증 정보 삭제
router.delete("/users/:username/certificate/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const updateUser = await User2.updateOne(
    {
      username: username,
    },
    {
      $pull: {
        certificate: _id,
      },
    }
  );
  res.json(updateUser);
});
// 수상 정보 추가
router.post("/users/:username/award", async (req, res) => {
  const username = req.params.username;
  const { awardName, issuingOrganization, issueDate } = req.body;
  const user = await User2.findOne({
    username,
  }).select("-password");
  const putUser = await Award.create({
    user: user._id,

    awardName,
    issuingOrganization,
    issueDate,
  });
  console.log(user.award);
  user.award.push(putUser._id);
  await user.save();
  res.json(user);
});

//개인 수상 수정
router.patch("/users/:username/award/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const { awardName, issuingOrganization, issueDate } = req.body;
  const user = await User2.findOne({
    username,
  }).select("-password");

  const patchUser = await Award.updateOne(
    {
      user: user._id,
      _id,
    },
    {
      $set: {
        awardName,
        issuingOrganization,
        issueDate,
      },
    }
  );
  user.award.push(patchUser._id);
  await user.save();
  res.json(patchUser);
});

//개인 페이지 삭제
router.delete("/users/:username/award/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const updateUser = await User2.updateOne(
    {
      username: username,
    },
    {
      $pull: {
        award: _id,
      },
    }
  );
  res.json(updateUser);
});

router.get("/users/:username/portfolio", async (req, res) => {
  const username = req.params.username;
  let putUser;

  try {
    putUser = await User2.findOne({
      username,
    }).populate("portfolioUrl");

    if (!putUser) {
      return res.status(404).send({
        Message: "User not found",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send({
      Message: "Internal Server Error",
    });
  }

  res.json(putUser); // 이제 putUser는 정의되었습니다.
});

//개인 페이지 추가 (학력)
router.post("/users/:username/portfolio", async (req, res) => {
  const username = req.params.username;
  const { link } = req.body;
  const user = await User2.findOne({
    username,
  }).select("-password");
  const putUser = await Portfolio.create({
    user: user._id,
    link,
  });
  console.log(putUser);
  user.portfolioUrl.push(putUser._id);
  await user.save();
  res.json(putUser);
});

//개인 페이지 수정
router.patch("/users/:username/portfolio/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const { link } = req.body;
  const user = await User2.findOne({
    username,
  }).select("-password");

  const patchUser = await Portfolio.updateOne(
    {
      user: user._id,
      _id,
    },
    {
      $set: {
        link,
      },
    }
  );
  user.portfolioUrl.push(patchUser._id);
  await user.save();
  res.json(patchUser);
});

//개인 페이지 삭제
router.delete("/users/:username/portfolio/:_id", async (req, res) => {
  const username = req.params.username;
  const _id = req.params._id;
  const updateUser = await User2.updateOne(
    {
      username: username,
    },
    {
      $pull: {
        portfolioUrl: _id,
      },
    }
  );
  res.json(updateUser);
});

module.exports = router;
