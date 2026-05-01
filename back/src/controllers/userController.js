const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');

/**
 * @route   POST /api/users/:userId/profile-picture
 * @desc    Upload or update user profile picture
 * @access  Private
 */
exports.uploadProfilePicture = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is updating their own profile or is admin
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 403, 
        message: 'Forbidden: You can only update your own profile' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        status: 400, 
        message: 'No image file provided' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 404, 
        message: 'User not found' 
      });
    }

    try {
      // Try to upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, 'profile-pictures');
      user.profilePicture = result.secure_url;
      console.log('Profile picture uploaded to Cloudinary:', result.secure_url);
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError.message);
      // Fallback: Convert to base64 data URL (for small images)
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      user.profilePicture = base64Image;
      console.log('Using base64 fallback for profile picture');
    }

    await user.save();

    console.log('Profile picture updated for user:', user._id);

    res.json({
      status: 200,
      message: 'Profile picture updated successfully',
      data: {
        userId: user._id,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      status: 500,
      message: 'Error uploading profile picture',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   POST /api/users/:userId/cover-image
 * @desc    Upload or update user cover image
 * @access  Private
 */
exports.uploadCoverImage = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is updating their own profile or is admin
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 403, 
        message: 'Forbidden: You can only update your own profile' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        status: 400, 
        message: 'No image file provided' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 404, 
        message: 'User not found' 
      });
    }

    try {
      // Try to upload to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, 'cover-images');
      user.coverImage = result.secure_url;
      console.log('Cover image uploaded to Cloudinary:', result.secure_url);
    } catch (cloudinaryError) {
      console.error('Cloudinary upload failed:', cloudinaryError.message);
      // Fallback: Convert to base64 data URL (for small images)
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      user.coverImage = base64Image;
      console.log('Using base64 fallback for cover image');
    }

    await user.save();

    console.log('Cover image updated for user:', user._id);

    res.json({
      status: 200,
      message: 'Cover image updated successfully',
      data: {
        userId: user._id,
        coverImage: user.coverImage
      }
    });
  } catch (error) {
    console.error('Cover image upload error:', error);
    res.status(500).json({
      status: 500,
      message: 'Error uploading cover image',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   GET /api/users/:userId
 * @desc    Get user profile including picture
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 404, 
        message: 'User not found' 
      });
    }

    res.json({
      status: 200,
      message: 'User profile retrieved successfully',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        coverImage: user.coverImage,
        bio: user.bio,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      status: 500,
      message: 'Error retrieving user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 403,
        message: 'Forbidden: Admin access required'
      });
    }

    // Fetch all users, excluding password
    const users = await User.find({ isActive: true })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json({
      status: 200,
      message: 'Users retrieved successfully',
      data: {
        users: users.map(user => ({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePicture: user.profilePicture,
          coverImage: user.coverImage,
          bio: user.bio,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        })),
        count: users.length
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      status: 500,
      message: 'Error retrieving users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, phone, bio } = req.body;

    // Check if user is updating their own profile or is admin
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        status: 403, 
        message: 'Forbidden: You can only update your own profile' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 404, 
        message: 'User not found' 
      });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    console.log('Profile updated:', user._id);

    res.json({
      status: 200,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverImage: user.coverImage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 500,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
