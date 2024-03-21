# React listing

A MERN stack for adding listings with images, titles, descriptions, and locations. Images are uploaded to Cloudinary, and the listings with image URLs are stored in MongoDB. The frontend is built using React.js with Bootstrap for styling.

## Installation

To run the server:

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies using yarn:
   ```
   yarn
   ```

3. Start the server:
   ```
   node server.js
   ```

To run the frontend:

1. Navigate to the root directory:
   ```
   cd ..
   ```

2. Install dependencies using yarn:
   ```
   yarn
   ```

3. Start the frontend:
   ```
   yarn start
   ```

## Environment Variables

Ensure you have a `.env` file in the server directory with the following variables:

```
MONGO_URL=<Your MongoDB Connection URL>
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
```

Replace the placeholder values with your actual MongoDB connection URL, Cloudinary cloud name, API key, and API secret.

## Technologies Used

- MongoDB
- Express.js
- React.js
- Node.js
- Bootstrap

## Folder Structure

```
my-mern-project/
│
├── server/                # Server-side code
│   ├── ...
│   ├── server.js          # Entry point of the server
│   └── ...
│
├── src/                   # Frontend source code
│   ├── ...
│   ├── components/        # React components
│   ├── App.js             # Main component
│   └── ...
│
└── .env                   # Environment variables file
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/fooBar`).
3. Commit your changes (`git commit -am 'Add some fooBar'`).
4. Push to the branch (`git push origin feature/fooBar`).
5. Create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or feedback, please contact [Helle Fruergaard ](mailto:hellefruergaardh@gmail.com).
