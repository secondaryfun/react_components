import React from 'react';
import createClass from 'create-react-class';
import Parse from 'html-react-parser'
import TextInput from 'react-autocomplete-input'
import 'react-autocomplete-input/dist/bundle.css'

function cleanup (word) {
	return word.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
 }

export const Sparknotes = createClass({

	UNSAFE_componentWillMount() {
		let accordion = [];
        let sparknotes = this.props.data
		let chapterList = []
		let searchTerms = []


		sparknotes.forEach((i) => {
			if(i.content) {
				chapterList.push(!i.chapter ? "" : i.chapter)
				i.content.forEach(j => {
					accordion.push({
						title: j.title,
						content: j.content,
						chapter: i.chapter,
						subchapter: j.subchapter,
						open: false	
				})
								
				});
			}
		})

		accordion.forEach( i => searchTerms.push(i.title) )

		this.setState({
			accordionItems: accordion,
			displayChapter: 1,
			chapterList: chapterList,
			searchTerms: searchTerms,
			activeSelection: null,
			searchValue: ""
		});
	},

	click(i) {
		const newAccordion = this.state.accordionItems.slice();
		const index = newAccordion.indexOf(i)

		newAccordion[index].open = !newAccordion[index].open;
		this.setState({ accordionItems: newAccordion });
	},
	
	handleChapterClick(i) {
		this.setState({ 
			displayChapter: i,
			activeSelection: null
		});
	},

	handleRequestOptions(part) {
		this.setState({searchValue: part})
	},

	handleSelectOption(selection) {
		selection = selection.slice(0,-1)
		const selectedItem = !this.state.accordionItems.find(o => cleanup(o.title) === cleanup(selection)) ? "not found" : this.state.accordionItems.find(o => cleanup(o.title.toUpperCase()) === cleanup(selection)) 
		this.setState({
			activeSelection:selectedItem,
			displayChapter: null,
			searchValue: ""
		})
	},

	render() {
		// Chapter Builder
		const chapterMenu = (
				<div className="accordion-chapter-menu">
					{this.state.chapterList.map(i => (
						<div 
						key={this.state.chapterList.indexOf(i)}
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
						/* 
						title: j.title,
						content: j.content,
						chapter: i.chapter,
						subchapter: j.subchapter,
						open: false	
						*/

		// Accordion Builder
		const sections = this.state.activeSelection ? 
			<div>
				<div
					className="accordion-title"
					// onClick={this.click.bind(null, i)}
				>
					<div className="accordion-arrow-wrapper">
						<i className={"accordion-fa fa-angle-down fa-rotate-180"}
						></i>
					</div>
					<span className="accordion-title-text">
						{this.state.activeSelection.title}
					</span>
				</div>
				<div className={"accordion-content accordion-content-open"}
				>
					<div className={"accordion-content-text accordion-content-text-open"}
					>
						{<ul>{this.state.activeSelection.content.map( i => Parse(i.listItem) )}</ul>}
					</div>
				</div>
			</div>
			: this.state.accordionItems.map((i) => {
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
								{<ul>{i.content.map( i => Parse(i.listItem) )}</ul>}
							</div>
						</div>
					</div>
				) : ""

			});

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
				/>
				{chapterMenu}
				<div className="accordion-section-wrapper">
					{sections}

				</div>
			</div>
		);
	}
});



