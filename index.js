const express = require("express")
const app = express()

const connectToDatabase = require("./db/db.connect")
connectToDatabase()

const Book = require("./model/book.model")

// For CORS Error
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function deleteBook(bookId) {
  try {
    const deleteBook = await Book.findByIdAndDelete(bookId)
    return deleteBook
  } catch (error) {
    throw error
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId)
    res
      .status(200)
      .json({
        error: "Book deleted successfully.",
        deletedBook: deletedBook,
      })
  } catch (error) {
    res.status(500).json({ error: "Book not found." })
  }
})

// async function updateBook(title, dataToUpdate) {
//   try {
//     const updatedBook = await Book.findOneAndUpdate(
//       { title: title },
//       dataToUpdate,
//       {
//         new: true,
//       }
//     )
//     return updatedBook
//   } catch (error) {
//     console.log("Error in updating Book", error)
//   }
// }

// app.use(express.json())
// app.post("/Books/title/:title", async (req, res) => {
//   try {
//     const updatedBook = await updateBook(req.params.title, req.body)
//     if (updatedBook) {
//       res.status(200).json({
//         message: "Book updated Successfully.",
//         updatedBook: updatedBook,
//       })
//     } else {
//       res.status(404).json({ error: "Book does not exist." })
//     }
//   } catch (error) {
//     res.status(500).json({ error: "failed to update Book." })
//   }
// })

// Get books by author
async function getBookByAuthor(author) {
  try {
    const book = await Book.find({ author: author })
    return book
  } catch (error) {
    throw error
  }
}

app.get("/books/author/:author", async (req, res) => {
  try {
    const books = await getBookByAuthor(req.params.author)
    if (books.length !== 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: "no books found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch books." })
  }
})

// Get books by title
async function getBookByTitle(title) {
  try {
    const book = await Book.findOne({ title: title })
    return book
  } catch (error) {
    throw error
  }
}

app.get("/books/title/:title", async (req, res) => {
  try {
    const books = await getBookByTitle(req.params.title)
    if (books.length !== 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: "no books found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch books." })
  }
})

// Get all books
async function getAllBooks() {
  try {
    const allBooks = await Book.find()
    return allBooks
  } catch (error) {
    throw error
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks()
    if (books.length !== 0) {
      res.json(books)
    } else {
      res.status(404).json({ error: "no book found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Fetch books." })
  }
})

async function addNewBook(newBook) {
  try {
    const book = new Book(newBook)
    const saveBook = await book.save()
    return saveBook
  } catch (error) {
    throw error
  }
}

app.use(express.json())
app.post("/addBook", async (req, res) => {
  try {
    const savedBook = await addNewBook(req.body)
    res
      .status(201)
      .json({ message: "Book added successfully", newBook: savedBook })
  } catch (error) {
    res.status(500).json({ error: "Failed to add Book" })
  }
})

require("dotenv").config()
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("Server is running on ", PORT)
})