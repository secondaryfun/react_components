import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import './accordion.css';
import sparkNotes from './data/spark_notes_2.json'
import Parse from 'html-react-parser'
import faqData from './data/faq.json'
import {FaqAccordion} from './faq.js'




const App = createClass({

	render() {
		

		return (
			<div>
				Test this out.
				<FaqAccordion data={faqData} />
				<Accordion data={sparkNotes} />
			</div>
		);
	}
});

const Accordion = createClass({

	componentWillMount() {
		let accordion = [];

		this.props.data.forEach((i) => {
			accordion.push({
				title: i.title,
				content: i.content,
				chapter: i.chapter,
				open: true
			});
		});

		this.setState({
			accordionItems: accordion,
			displayChapter: 1,
			chapterList: [1,2,3,4,5]
		});
	},

	click(i) {
		const newAccordion = this.state.accordionItems.slice();
		const index = newAccordion.indexOf(i)

		newAccordion[index].open = !newAccordion[index].open;
		this.setState({ accordionItems: newAccordion });
	},
	
	handleChapterClick(i) {
		this.setState({ displayChapter: i });
	},

	render() {
		// Chapter Builder
		const chapterMenu = (
				<div className="accordion-chapter-menu">
					{this.state.chapterList.map(i => (
						<div 
						className={`
						accordion-chapter-menu-btn 
						${this.state.displayChapter === i ? 
							"accordion-chapter-menu-btn--active" : "" }
							`}
						onClick={this.handleChapterClick.bind(null, i)}
						
						>
							<span>
								CH {i}
							</span>
						</div>
					))}
				</div>
			
		)


		// Accordion Builder
		const sections = this.state.accordionItems.map((i) => {
			const chapter = parseInt(i.chapter)
			
			return chapter === this.state.displayChapter ? (
				<div key={this.state.accordionItems.indexOf(i)}>
					<div
						className="accordion-title"
						onClick={this.click.bind(null, i)}
					>
						<div className="accordion-arrow-wrapper">
							<i className={i.open
								? "accordion-fa fa-angle-down fa-rotate-180"
								: "accordion-fa fa-angle-down"}
							></i>
						</div>
						<span className="accordion-title-text">
							{i.title}
						</span>
					</div>
					<div className={i.open
						? "accordion-content accordion-content-open"
						: "accordion-content"}
					>
						<div className={i.open
							? "accordion-content-text accordion-content-text-open"
							: "accordion-content-text"}
						>
							{contentList(i.content)}
						</div>
					</div>
				</div>
			) : ""

						});

		return (
			<div className="accordion">
				{chapterMenu}
				<div className="accordion-section-wrapper">
					{sections}

				</div>
			</div>
		);
	}
});

function contentList(listItems) {
	return (
		<ul>{listItems.map(i => (
			Parse(i)
		))}</ul>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById('accordion')
);