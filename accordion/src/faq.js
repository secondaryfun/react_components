import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import './accordion.css';
import faqData from './data/faq.json'
import marked from 'marked'
import Parse from 'html-react-parser'



// const App = createClass({

// 	render() {
		

// 		return (
// 			<Accordion data={faqData} />
// 		);
// 	}
// });

export const FaqAccordion = createClass({

	componentWillMount() {
		let accordion = []
		let tags = ['All']
		let severities = ['All']
		let errata = this.props.data.Errata
		let faq = this.props.data.FAQ
		faq.forEach((i) => {
			if(i.Description) {
				tags.push(!i.Tag ? "" : i.Tag)
				accordion.push({
					type: 'faq',
					title: !i.Description ? "" : i.Description.split('\n')[0].substring(3),
					content: !i.Description ? "" : i.Description,
					tag: !i.Tag ? "" : i.Tag,
					spoiler: !i.Spoiler ? null : i.Spoiler,
					open: false
					
				});
			}
		})
		errata.forEach((i) => {
			if(i.Description) {
				severities.push(!i.Severity ? "" : i.Severity)
				accordion.push({
					type: 'errata',
					title: !i.Description ? "" : i.Description.slice(0,25),
					content: !i.Description ? "" : i.Description,
					component: !i.Component ? "" : i.Component,
					severity: !i.Severity ? "" : i.Severity,
					spoiler: !i.Spoiler ? null : i.Spoiler,
					open: false
					
				});
			}
		})
		
		const tagSet = new Set(tags)
		tags = [...tagSet]
		const sevSet = new Set(severities)
		severities = [...sevSet]


		this.setState({
			accordionItems: accordion,
			displayTag: 'All',
			tags: tags,
			displaySev: 'All',
			sevs: severities,
			activeMenu: 'errata',
		});
	},

	click(i) {
		const newAccordion = this.state.accordionItems.slice();
		const index = newAccordion.indexOf(i)

		newAccordion[index].open = !newAccordion[index].open;
		this.setState({ accordionItems: newAccordion });
	},
	
	handleChapterClick(i) {
		this.setState({ displayTag: i });
	},

	render() {
		// Chapter Builder
		const chapterMenu = (this.state.activeMenu === 'faq' ? (
					<div className="accordion-chapter-menu">
						{this.state.tags.map(i => (
							<div 
							className={`
							accordion-chapter-menu-btn 
							${this.state.displayTag === i ? 
								"accordion-chapter-menu-btn--active" : "" }
								`}
							onClick={this.handleChapterClick.bind(null, i)}
							
							>
								<span>
									{i}
								</span>
							</div>
						))}
					</div>
				) : (
					<div className="accordion-chapter-menu">
						{this.state.sevs.map(i => (
							<div 
							className={`
							accordion-chapter-menu-btn 
							${this.state.displayTag === i ? 
								"accordion-chapter-menu-btn--active" : "" }
								`}
							onClick={this.handleChapterClick.bind(null, i)}
							
							>
								<span>
									{i}
								</span>
							</div>
						))}
					</div>
				)
			
		)


		// Accordion Builder
		const sections = this.state.accordionItems.map((i) => {
			if(this.state.activeMenu === "faq") {
				return i.tag === this.state.displayTag || this.state.displayTag === 'All' ? (
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
								<span className="faq-spoiler">{!i.spoiler ? "" : "***Spoiler!*** |"}</span>
								<span className="faq-tag">{!i.tag ? "" : `${i.tag} | `}</span>
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
								{Parse(marked(i.content))}
							</div>
						</div>
					</div>
				) : ""
			} else {
				return i.severity === this.state.displaySev || this.state.displaySev === 'All' ? (
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
								<span className="faq-spoiler">{!i.spoiler ? "" : "***Spoiler!*** |"}</span>
								<span className="errata-severity">{!i.severity ? "" : `${i.severity} | `}</span>
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
								{Parse(marked(i.content))}
							</div>
						</div>
					</div>
				) : ""
			} 
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

// ReactDOM.render(
// 	<App />,
// 	document.getElementById('faqAccordion')
// );

