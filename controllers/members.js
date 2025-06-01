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
  const { name, role, joinYear, leaveYear, reunionYear } = req.body;

  if (!name || !role || !joinYear) {
    return res.status(400).json({ message: 'Name, role, and joinYear are required.' });
  }
  if (typeof joinYear !== 'number' || joinYear < 1985) {
    return res.status(400).json({ message: 'Join year must be a number and not less than 1985.' });
  }
  if (leaveYear && leaveYear !== 'Continues' && (typeof leaveYear !== 'string' || Number(leaveYear) < joinYear)) {
    return res.status(400).json({ message: 'Leave year must be "Continues" or a year greater than or equal to joinYear.' });
  }
  if (reunionYear && (typeof reunionYear !== 'number' || reunionYear < 1985)) {
    return res.status(400).json({ message: 'Reunion year must be a number and not less than 1985.' });
  }
  const memberData = {
    name,
    role,
    joinYear,
    leaveYear,
    reunionYear
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
  const { name, role, joinYear, leaveYear, reunionYear } = req.body;

  if (name === undefined || role === undefined || joinYear === undefined) {
    return res.status(400).json({ message: 'Name, role, and joinYear are required for update.' });
  }
  if (typeof joinYear !== 'number' || joinYear < 1985) {
    return res.status(400).json({ message: 'Join year must be a number and not less than 1985.' });
  }
  if (leaveYear && leaveYear !== 'Continues' && (typeof leaveYear !== 'string' || Number(leaveYear) < joinYear)) {
    return res.status(400).json({ message: 'Leave year must be "Continues" or a year greater than or equal to joinYear.' });
  }
  if (reunionYear && (typeof reunionYear !== 'number' || reunionYear < 1985)) {
    return res.status(400).json({ message: 'Reunion year must be a number and not less than 1985.' });
  }

  const memberData = {
    name,
    role,
    joinYear,
    leaveYear,
    reunionYear
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