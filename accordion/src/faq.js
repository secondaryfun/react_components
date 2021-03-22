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
		let faqAccordion = []
		let errataAccordion = []
		let tags = ['All']
		let components = ['All']
		let types = ["Errata","FAQ"]
		let errata = this.props.data.Errata
		let faq = this.props.data.FAQ
		faq.forEach((i) => {
			if(i.Description) {
				tags.push(!i.Tag ? "" : i.Tag)
				faqAccordion.push({
					type: 'faq',
					title: !i.Description ? "" : i.Description.split('\n')[0].substring(3),
					content: !i.Description ? "" : i.Description,
					tag: !i.Tag ? "" : i.Tag,
					spoiler: !i.Spoiler ? null : i.Spoiler,
					severity: null,
					open: false
					
				});
			}
		})
		errata.forEach((i) => {
			if(i.Description) {
				components.push(!i.Component ? "" : i.Component)
				errataAccordion.push({
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
		const sevSet = new Set(components)
		components = [...sevSet]


		this.setState({
			faqAccordion: faqAccordion,
			errataAccordion: errataAccordion,
			activeAccordion: errataAccordion,
			activeHeaders: components,
			types: types,
			displayMenu: 'All',
			tags: tags,
			components: components,
			activeMenu: types[0],
		});
	},

	click(i) {
		const newAccordion = this.state.activeAccordion.slice();
		const index = newAccordion.indexOf(i)

		newAccordion[index].open = !newAccordion[index].open;
		this.setState({ activeAccordion: newAccordion });
	},

	handleClickType(i) {
		let menu = i === 'Errata' ? this.state.errataAccordion : this.state.faqAccordion
		let headers = i === 'Errata' ? this.state.components : this.state.tags
		this.setState({activeMenu: i, activeAccordion: menu, displayMenu: "All", activeHeaders: headers })
	},
	
	handleChapterClick(i) {
		this.setState({ displayMenu: i});
	},

	handleFilterChange(e) {
		console.log(e.target)
		this.setState({displayMenu: e.target.value})
	},

	render() {
		// Chapter Builder
		const typeMenu = (
			<div className="accordion-chapter-menu">
				{this.state.types.map(i => (
					<div 
					className={`
					accordion-chapter-menu-btn 
					${this.state.activeMenu === i ? 
						"accordion-chapter-menu-btn--active" : "" }
						`}
					onClick={this.handleClickType.bind(null, i)}
					
					>
						<span>
							{i}
						</span>
					</div>
				))}
			</div>
		)
		const chapterMenu = (this.state.activeMenu === 'FAQ' ? (
					<div className="accordion-chapter-menu">
						{this.state.tags.map(i => (
							<div 
							className={`
							accordion-chapter-menu-btn 
							${this.state.displayMenu === i ? 
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
						{this.state.components.map(i => (
							<div 
							className={`
							accordion-chapter-menu-btn 
							${this.state.displayMenu === i ? 
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
		const filterList = filter(this.state.activeHeaders, this.state.displayMenu, this.handleFilterChange)


		// Accordion Builder
		let sections
		if(this.state.activeMenu === "FAQ") {
		sections = this.state.activeAccordion.map((i) => {
				return i.tag === this.state.displayMenu || this.state.displayMenu === 'All' ? (
					<div key={this.state.activeAccordion.indexOf(i)}>
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
			}) 
		} else {
			sections = this.state.activeAccordion.map((i) => {
				return i.component === this.state.displayMenu || this.state.displayMenu === 'All' ? (
					<div key={this.state.activeAccordion.indexOf(i)}>
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
			} )
		};

		return (
			<div className="accordion">
				{typeMenu}
				{filterList}
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

function filter(list, def, callback) {

	// {list, def, callback} = {...props.data}
	return (
		<div>
				<select defaultValue={def} 
				onChange={callback} 
				>
					{
						list.map(i => (<option value={i}>{i}</option>))
					}
					{/* <option value="Orange">Orange</option>
					<option value="Radish">Radish</option>
					<option value="Cherry">Cherry</option> */}
				</select>
				<p>This is a filter.</p>
			</div> 
	)
}

// ReactDOM.render(
// 	<App />,
// 	document.getElementById('faqAccordion')
// );

