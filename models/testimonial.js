import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    verified: { type: Boolean, default: false },
    gmail:{type:String, required: true,
        unique: true,  // Add unique constraint
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please enter a valid Gmail address']
  },
    date: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;