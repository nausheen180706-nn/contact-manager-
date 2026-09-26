const Contact = require('../models/Contact');
const mongoose = require('mongoose');

/**
 * @desc    Get all contacts or search contacts
 * @route   GET /api/contacts
 * @route   GET /api/contacts?search=query
 * @access  Public
 */
const getContacts = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } }
        ]
      };
    }

    // Sort newest contacts first
    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Contacts fetched successfully',
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get contact statistics
 * @route   GET /api/contacts/stats
 * @access  Public
 */
const getContactStats = async (req, res, next) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const activeContacts = await Contact.countDocuments({ isActive: true });

    // Contacts created within the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAdded = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalContacts,
        activeContacts,
        recentlyAdded
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single contact by ID
 * @route   GET /api/contacts/:id
 * @access  Public
 */
const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact fetched successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new contact
 * @route   POST /api/contacts
 * @access  Public
 */
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, isActive } = req.body;

    // Check for duplicate email before save for clearer error response
    if (email) {
      const existingContact = await Contact.findOne({
        email: email.trim().toLowerCase()
      });
      if (existingContact) {
        return res.status(400).json({
          success: false,
          message: 'Contact with this email already exists'
        });
      }
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      isActive: typeof isActive === 'boolean' ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a contact
 * @route   PUT /api/contacts/:id
 * @access  Public
 */
const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Check if another contact already has this email
    if (email) {
      const emailDuplicate = await Contact.findOne({
        _id: { $ne: id },
        email: email.trim().toLowerCase()
      });
      if (emailDuplicate) {
        return res.status(400).json({
          success: false,
          message: 'Another contact with this email already exists'
        });
      }
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (email !== undefined) updatedData.email = email;
    if (phone !== undefined) updatedData.phone = phone;
    if (isActive !== undefined) updatedData.isActive = isActive;

    const contact = await Contact.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a contact
 * @route   DELETE /api/contacts/:id
 * @access  Public
 */
const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update contact status (toggle active/inactive)
 * @route   PATCH /api/contacts/:id/status
 * @access  Public
 */
const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Please provide isActive as a boolean'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactStats,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  updateContactStatus
};
