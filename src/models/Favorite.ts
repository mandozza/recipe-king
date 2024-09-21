import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
	userId: string;
	recipeId?: string;
}

const FavoriteSchema: Schema = new Schema({
	userId: { type: String, required: true },
	recipeId: { type: String, required: true },
});

export const Favorite =
	mongoose.models?.Favorite ||
	mongoose.model<IFavorite>('Favorite', FavoriteSchema);
