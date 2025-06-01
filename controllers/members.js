const Member = require('../models/members');

const getAll = async (req, res) => {
  try {
    const members = await Member.find({});
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Error on server.' });
  }
};

const getSingle = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Error on server.' });
  }
};

const createMember = async (req, res) => {
  const memberData = {
    name: req.body.name,
    role: req.body.role,
    joinYear: req.body.joinYear,
    leaveYear: req.body.leaveYear,
    reunionYear: req.body.reunionYear
  };

  try {
    const newMember = new Member(memberData);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(400).json({ message: error.message || 'Error creating member.' });
  }
};

const updateMember = async (req, res) => {
  const memberData = {
    name: req.body.name,
    role: req.body.role,
    joinYear: req.body.joinYear,
    leaveYear: req.body.leaveYear,
    reunionYear: req.body.reunionYear
  };

  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, memberData, {
      new: true,
      runValidators: true
    });
    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found.' });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(400).json({ message: error.message || 'Error updating member.' });
  }
};

const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ message: 'Error on server.' });
  }
};

module.exports = {
  getAll,
  getSingle,
  createMember,
  updateMember,
  deleteMember
};