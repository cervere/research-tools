import React, { useState, useEffect } from 'react';
import Subsection from './Subsection';

const FormComponent = () => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Load form data from local storage when the component mounts
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Save form data to local storage when the form is submitted
    localStorage.setItem('formData', JSON.stringify(formData));
    // You can also send the data to your server if needed
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="grid">
        <Subsection />
        <Subsection />
        <Subsection />
        <article></article>
        <article></article>
        <article></article>
        <article></article>
        <article></article>
        <article></article>
        <article></article>
      </section>
    </form>
  );
};

export default FormComponent;
