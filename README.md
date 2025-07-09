# Inkr - Your Thoughts, Inked.

## Project Description

Inkr is a simple, intuitive, and visually appealing note-taking application designed to help you capture and organize your thoughts effortlessly. With a focus on user experience and modern design, Inkr provides a seamless way to create, manage, and personalize your notes.

## Features

-   **Core Note Management:** Easily create, edit, and delete notes.
-   **Rich Text with Markdown:** Supports basic Markdown for text formatting, including **bold** and *italic*.
-   **Custom Text Coloring:** Personalize your notes further with custom text colors using a simple `[c-COLOR]Your Text[c]` syntax (e.g., `[c-r]Red Text[c]`, `[c-b]Blue Text[c]`). Supported colors include red, blue, green, yellow, purple, pink, indigo, gray, black, and white.
-   **Themed Notes (Color Plates):** Assign different color themes to your notes for better organization and visual distinction. The note content text color intelligently adapts for readability in both light and dark modes.
-   **Note Pinning:** Pin important notes to the top for quick access.
-   **Note Favoriting:** Mark notes as favorites to easily filter and find them later.
-   **Dark Mode Compatibility:** Enjoy a comfortable viewing experience with full support for dark mode, ensuring text readability across all note themes.
-   **Search Functionality:** Quickly find your notes by searching through their content.
-   **Filtering & Sorting:** Filter notes by favorites or pinned status, and sort them by newest or oldest.
-   **Intuitive Swipe Gestures:** Perform quick actions like deleting or editing notes with simple left/right swipe gestures on note cards.
-   **Responsive Design:** Access and manage your notes seamlessly across various devices and screen sizes.

## Technologies Used

-   **React:** A JavaScript library for building user interfaces.
-   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
-   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
-   **`react-markdown`:** A React component to render Markdown.
-   **`remark-gfm`:** A `remark` plugin to support GitHub Flavored Markdown (GFM).
-   **`rehype-raw`:** A `rehype` plugin to compile Markdown to HTML, allowing for custom HTML injection (used for custom text coloring).

## Getting Started

Follow these steps to set up and run the Inkr application locally on your machine.

### Prerequisites

-   Node.js (LTS version recommended)
-   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd notepad-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

To start the development server and view the application in your browser:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

-   **Creating a Note:** Type your title and content in the input area at the top. Use the color palette icon to select a theme for your note. Click 'Save' to add the note.
-   **Editing a Note:** Swipe right on a note card to open the edit modal. Make your changes and click 'Save'.
-   **Deleting a Note:** Swipe left on a note card to move it to trash. You can undo this action from the snackbar.
-   **Pin/Favorite:** Click the pin or heart icon on a note card to toggle its pinned or favorite status.
-   **Markdown & Custom Colors:** Use `**text**` for bold, `*text*` for italic. For custom colors, use `[c-COLOR]Your Text[c]` (e.g., `[c-r]Hello[c]`).
-   **Search & Filter:** Use the search icon to reveal the search bar. Use the sort/filter icon to cycle through different viewing modes (All, Favorites, Pinned) and sort orders.

## License

[Specify your license here, e.g., MIT License]