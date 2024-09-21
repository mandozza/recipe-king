import mongoose from 'mongoose';

// Define the schema
const recipeSchema = new mongoose.Schema({
	title: String,
	image: String,
	time: Number,
	description: String,
	vegan: Boolean,
});

export const Recipe =
	mongoose.models?.Recipe || mongoose.model('Recipe', recipeSchema);
