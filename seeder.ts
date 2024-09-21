import mongoose from 'mongoose';
import connectDB from './src/lib/db';
import { Recipe } from './src/models/Recipe';
import { recipes } from './src/data/recipes';

//to run this file, run the following command in the terminal
// npm run seed.
// some things you need to do before running this file:
// update package.json file to include the following:
// "scripts": {
///       ...
//    		"seed": "ts-node --project tsconfig.seeder.json seeder.ts"
//    	},

// Create a new tsconfig file called tsconfig.seeder.json in the root directory of your project and add the following:
//{
//	"extends": "./tsconfig.json",
//	"compilerOptions": {
//		"module": "CommonJS"
//	}
//}

// in db.ts file, hardcode the connection string to the local mongodb server.

// Insert recipes into the database
const seedDB = async () => {
	try {
		await connectDB(); // Establish the database connection
		await Recipe.deleteMany(); // Clear existing data
		await Recipe.insertMany(recipes); // Insert new data
		console.log('Data successfully seeded!');
	} catch (error) {
		console.log('Error seeding data:', error);
	} finally {
		mongoose.connection.close(); // Close the connection
	}
};

seedDB();
