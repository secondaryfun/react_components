import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import './accordion.css';
import sparkNotes from './data/sparknotes.json'
import faqData from './data/faq.json'
import {FaqAccordion} from './faq.js'
import {Sparknotes} from './sparknotes.js'




const App = createClass({

	render() {
		

		return (
			<div>
				Test this out.
				<FaqAccordion data={faqData} />
				<Sparknotes data={sparkNotes} />
			</div>
		);
	}
});



ReactDOM.render(
	<App />,
	document.getElementById('accordion')
);