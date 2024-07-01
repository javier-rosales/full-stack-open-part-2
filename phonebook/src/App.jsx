import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/people'

const SearchFilter = ({searchTerm, onSearch}) => {
  return (
    <input
      value={searchTerm}
      onChange={onSearch}
    />
  )
}

const FormAddPerson = ({
  name,
  onNameChange,
  phoneNumber,
  onPhoneNumberChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:
        <input
          value={name}
          onChange={onNameChange}
        />
      </div>
      <div>
        number:
        <input
          value={phoneNumber}
          onChange={onPhoneNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const SavedPeople = ({people, onDelete}) => {
  return (
    <ul>
      {people.length > 0
      ?
        people.map(person =>
          <SavedPerson
            key={person.id}
            person={person}
            onDelete={onDelete}
          />
        )
      :
        <p>No contacts found</p>
      }
    </ul>
  )
}

const SavedPerson = ({person, onDelete}) => {
  return (
    <li>
      {person.name} {person.phoneNumber}
      <button onClick={() => onDelete(person)}>
        Delete
      </button>
    </li>
  )
}

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

const App = () => {
  const [people, setPeople] = useState([]) 
  const [newName, setNewName] = useState("")
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPeople => {
        setPeople(initialPeople)
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const repeatedPerson = people.find(person => person.name === newName)

    if (repeatedPerson) {
      const confirmation = confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmation) {
        const updatedPerson = {
          ...repeatedPerson,
          phoneNumber: newPhoneNumber
        }

        personService
          .update(repeatedPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPeople(people.map(person =>
              person.id === returnedPerson.id ? returnedPerson : person
            ))
            setNewName("")
            setNewPhoneNumber("")
            setNotificationMessage(`Updated ${returnedPerson.name}`)
            setNotificationType("succeed")
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(error => {
            setNotificationMessage(
              `${repeatedPerson.name} was already deleted from the server`
            )
            setNotificationType("error")
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
            setPeople(people.filter(person => person.id !== repeatedPerson.id))
          })
      }
    } else {
      const personObject = {
        name: newName,
        phoneNumber: newPhoneNumber
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPeople(people.concat(returnedPerson))
          setNewName("")
          setNewPhoneNumber("")
          setNotificationMessage(`Added ${returnedPerson.name}`)
          setNotificationType("succeed")
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = person => {
    const confirmation = confirm(`Delete ${person.name}?`)
  
    if (confirmation) {
      personService
        .deletePerson(person.id)
        .then(returnedPerson => {
          setPeople(people.filter(person => person.id !== returnedPerson.id))
          setNotificationMessage(`Deleted ${returnedPerson.name}`)
          setNotificationType("succeed")
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setNotificationMessage(
            `${person.name} was already deleted from the server`
          )
          setNotificationType("error")
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setPeople(people.filter(p => p.id !== person.id))
        })
    }
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handlePhoneNumberChange = event => {
    setNewPhoneNumber(event.target.value)
  }

  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value)
  }

  const peopleToShow = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        type={notificationType}
      />
      <SearchFilter
        searchTerm={searchTerm}
        onSearch={handleSearchTermChange}
      />
      <h3>Add a new</h3>
      <FormAddPerson
        name={newName}
        onNameChange={handleNameChange}
        phoneNumber={newPhoneNumber}
        onPhoneNumberChange={handlePhoneNumberChange}
        onSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <SavedPeople
        people={peopleToShow}
        onDelete={deletePerson}
      />
    </div>
  )
}

export default App
