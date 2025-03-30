# LokalApp Job Assignment

A React Native application for browsing and managing job listings with features like job search, bookmarking, and detailed job information.

## Features

- **Job Listings**: Browse through available jobs with infinite scroll
- **Job Details**: View comprehensive information about each job
- **Bookmarking**: Save and manage favorite jobs
- **Search**: Search through available jobs
- **Responsive Design**: Works on both iOS and Android platforms
- **Offline Support**: Bookmarked jobs are stored locally

## Tech Stack

- React Native
- Expo
- React Navigation
- AsyncStorage
- Context API for state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/LokalApp_JobAssignment.git
cd LokalApp_JobAssignment
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

4. Run on your preferred platform:

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Project Structure

```
src/
├── components/         # Reusable UI components
├── screens/           # Screen components
├── services/          # API and storage services
├── context/           # Context providers
├── navigation/        # Navigation configuration
└── utils/            # Utility functions
```

## Key Components

### JobCard

A reusable component for displaying job information in a card format.

### JobDetailScreen

Detailed view of a specific job with all available information.

### BookmarksScreen

Screen for managing bookmarked jobs.

### JobsScreen

Main screen displaying the list of available jobs with infinite scroll.

## API Integration

The app uses a mock API service (`src/services/api.js`) to fetch job data. In a production environment, you would replace this with your actual API endpoints.

## State Management

The app uses React Context for state management, particularly for handling bookmarked jobs across the application.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Expo team for the excellent development tools
- React Native community for resources and support
- All contributors who have helped with the project

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/LokalApp_JobAssignment](https://github.com/yourusername/LokalApp_JobAssignment)
