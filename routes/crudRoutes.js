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
router.post("/users/:username/certificates", async (req, res) => {
  const username = req.params.username;
  const { name, issuingOrganization, issueDate } = req.body;
  const user = await User2.findOne({ username }).select("-password");

  const certificate = await Certificate.create({
    name,
    issuingOrganization,
    issueDate,
  });
  user.certificates.push(certificate._id);
  await user.save();
  res.json(certificate);
});

// 자격증 정보 조회
router.get("/users/:username/certificates", async (req, res) => {
  const username = req.params.username;
  const user = await User2.findOne({ username }).populate("certificates");
  res.json(user.certificates);
});

// 자격증 정보 수정
router.patch("/users/:username/certificates/:_id", async (req, res) => {
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

module.exports = router;
