import React, {useState, useEffect} from 'react';

const Subsection = (props) => {
    const {title, updateArticleData} = props;
    const [textContent, setTextContent] = useState('');

    useEffect(() => {
        if(textContent !== '') {
            updateArticleData(title, textContent);
        } 
    }, [textContent]);

    const onTextInput = (e) => {
        setTextContent(e.target.value);
    }

    return (
    <article>
        <h3> {title} </h3>
        <textarea 
        id="message" 
        name="message" 
        className="subsection-text"
        value={textContent}
        onChange={onTextInput}
        />
    </article>    
    )
}

export default Subsection