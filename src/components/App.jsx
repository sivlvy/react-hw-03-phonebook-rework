import ContactForm from './ContactForm/ContactForm';
import Container from './Container/Container';
import Filter from './Filter/Filter';
import ContactsList from './ContactsList/ContactsList';
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix';

export const App = () => {
	const [contacts, setContacts] = useState(() => {
		const storedContacts = localStorage.getItem('contacts');
		return storedContacts ? JSON.parse(storedContacts) : [];
	});

	const [filter, setFilter] = useState('');

	useEffect(() => {
		localStorage.setItem('contacts', JSON.stringify(contacts));
	}, [contacts]);

	const handleChange = e => {
		setFilter(e.currentTarget.value);
	};

	const formSubmitHandler = data => {
		const newContact = { id: nanoid(), ...data };

		const inContacts = contacts.some(
			({ name }) => name.toLowerCase() === newContact.name.toLowerCase()
		);
		if (inContacts) {
			Notify.failure(`${newContact.name} is already in contacts`);
			return;
		}
		Notify.success(`${newContact.name} was added to contacts`);
		setContacts([...contacts, newContact]);
	};

	const visibleContacts = contacts.filter(contact =>
		contact.name.toLowerCase().includes(filter.toLowerCase())
	);

	const deleteContact = contactId => {
		const deletedContact = contacts.find(contact => contact.id === contactId);
		if (!deletedContact) {
			return;
		}

		const updatedContacts = contacts.filter(
			contact => contact.id !== contactId
		);
		setContacts(updatedContacts);

		Notify.success(`${deletedContact.name} was deleted from contacts`);
	};

	return (
		<Container>
			<div className="flex justify-between">
				<div className="">
					<h1 className="font-bold text-xl text-center font-mono mb-10">
						Phonebook
					</h1>
					<ContactForm onSubmit={formSubmitHandler} />
				</div>
				<div>
					<h2 className="font-bold text-center text-xl mb-10">Contacts</h2>
					<Filter onChange={handleChange} />
					<ContactsList
						contacts={visibleContacts}
						onDeleteContact={deleteContact}
					/>
				</div>
			</div>
		</Container>
	);
};
