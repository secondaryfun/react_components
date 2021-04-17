import React from 'react';
import createClass from 'create-react-class';
import './accordion.css';
import marked from 'marked'
import Parse from 'html-react-parser'
import TextInput from 'react-autocomplete-input'
import 'react-autocomplete-input/dist/bundle.css'

function cleanup (word) {
	return word.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
 }

export const FaqAccordion = createClass({

	UNSAFE_componentWillMount() {
		let faqAccordion = []
		let errataAccordion = []
		const errataSearchTerms = []
		const faqSearchTerms = []
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

		faqAccordion.forEach( i => faqSearchTerms.push(i.title) )
		errataAccordion.forEach( i => errataSearchTerms.push(i.content) )


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
			activeSelection: null,
			searchValue: "",
			searchTerms: errataSearchTerms,
			errataSearchTerms: errataSearchTerms,
			faqSearchTerms: faqSearchTerms
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
		let searchTerms = i === "Errata" ? this.state.errataSearchTerms : this.state.faqSearchTerms
		this.setState({
			activeMenu: i, 
			activeAccordion: menu, 
			displayMenu: "All", 
			activeHeaders: headers,
			searchTerms: searchTerms,
			activeSelection: null
		})
	},
	
	handleChapterClick(i) {
		console.log(i)
		this.setState({displayMenu: i});
	},

	handleFilterChange(e) {
		console.log(e.target.value)
		this.setState({
			displayMenu: e.target.value,
			activeSelection: null
		})
	},

	handleRequestOptions(part) {
		this.setState({searchValue: part})
	},

	handleSelectOption(selection) {
		selection = selection.slice(0,-1)
		const selectedItem = this.state.activeMenu === "Errata" ?
			this.state.errataAccordion.find(o => cleanup(o.content) === cleanup(selection))  
		:
			this.state.faqAccordion.find(o => cleanup(o.title) === cleanup(selection))
		const filterText = selectedItem.component ? selectedItem.component : selectedItem.tag
		this.setState({
			activeSelection:selectedItem,
			displayChapter: null,
			searchValue: "",
			displayMenu: filterText
		})
		
	},

	render() {
		// Chapter Builder
		const typeMenu = (
			<div className="accordion-chapter-menu">
				{this.state.types.map(i => (
					<div 
					key={this.state.types.indexOf(i)}
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
		const chapterMenu = (
				<div className="accordion-chapter-menu">
					{this.state.activeHeaders.map(i => (
						this.state.displayMenu !== i ? "" : 
							<div
								key={this.state.types.indexOf(i)}
								className='accordion-chapter-menu-btn'
								onClick={this.handleChapterClick.bind(null, i)}
								>
								<span>
								{i}
								</span>
							</div>	
						
						))} 
						</div>
				
		)
			
		const filterList = filter(this.state.activeHeaders, this.state.displayMenu, this.handleFilterChange)

		// Accordion Builder
		let sections 

		if(this.state.activeSelection) {
			sections =  this.state.activeMenu === "FAQ" ?
				<div>
					<div
						className="accordion-title"
					>
						<div className="accordion-arrow-wrapper">
							<i className={"accordion-fa fa-angle-down fa-rotate-180"}
							></i>
						</div>
						<span className="accordion-title-text">
							<span className="faq-spoiler">{!this.state.activeSelection.spoiler ? "" : "***Spoiler!*** |"}</span>
							<span className="faq-tag">{!this.state.activeSelection.tag ? "" : `${this.state.activeSelection.tag} | `}</span>
							{this.state.activeSelection.title}
						</span>
					</div>
					<div className={"accordion-content accordion-content-open"}
					>
						<div className={"accordion-content-text accordion-content-text-open"}
						>
							{Parse(marked(this.state.activeSelection.content))}
						</div>
					</div>
				</div>
				:
				<div>
						<div
							className="accordion-title"
						>
							<div className="accordion-arrow-wrapper">
								<i className={"accordion-fa fa-angle-down fa-rotate-180"}></i>
							</div>
							<span className="accordion-title-text">
								<span className="faq-spoiler">{!this.state.activeSelection.spoiler ? "" : "***Spoiler!*** |"}</span>
								<span className="errata-severity">{!this.state.activeSelection.severity ? "" : `${this.state.activeSelection.severity} | `}</span>
								{this.state.activeSelection.title}
							</span>
						</div>
						<div className={"accordion-content accordion-content-open"}>
							<div className={"accordion-content-text accordion-content-text-open"}>
								{Parse(marked(this.state.activeSelection.content))}
							</div>
						</div>
					</div>
		 } else {
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
		}};

		return (
			<div className="accordion">
				<TextInput 
					onChange={this.handleRequestOptions} 
					options={this.state.searchTerms} 
					className="accordion-chapter-menu-btn"
					trigger=""
					Component="input"
					onSelect={this.handleSelectOption}
					matchAny={true}
					value={this.state.searchValue}
					spacer=''
					// defaultValue={this.state.selectedItem}
					defaultValue="animal"
				/>
				{typeMenu}
				{filterList}
				{/* {chapterMenu} */}
				<div className="accordion-section-wrapper">
					{sections}

				</div>
			</div>
		);
	}
});

function filter(list, def, callback) {

	return (
		<div>
				<select  
				value={def}
				className="accordion-chapter-menu-btn"
				onChange={callback} 
				>
					{
						list.map(i => (<option value={i} key={list.indexOf(i)} >{i}</option>))
					}
				</select>
			</div> 
	)
}





