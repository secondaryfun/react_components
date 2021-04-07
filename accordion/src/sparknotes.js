import React from 'react';
import createClass from 'create-react-class';
import Parse from 'html-react-parser'




export const Sparknotes = createClass({

	componentWillMount() {
		let accordion = [];
        let sparknotes = this.props.data
		console.log(sparknotes)
		let chapterList = []
		
        // this.props.data[2].Sparknotes.forEach((i) => {
        //     console.log(i)

		// 	accordion.push({
		// 		title: i.TITLE,
		// 		content: i.CONTENT,
		// 		chapter: i.CHAPTER,
		// 		type: i.TYPE,
		// 		subchapter: i.SUBCHAPTER,
		// 		order: i.ORDER,
		// 		open: true
		// 	});
		// });

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

		this.setState({
			accordionItems: accordion,
			displayChapter: 1,
			chapterList: chapterList
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
						/* 
						title: j.title,
						content: j.content,
						chapter: i.chapter,
						subchapter: j.subchapter,
						open: false	
						*/

		// Accordion Builder
		const sections = this.state.accordionItems.map((i) => {
			const chapter = parseInt(i.chapter)
			const subchapter = parseInt(i.subchapter)
			
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
				{chapterMenu}
				<div className="accordion-section-wrapper">
					{sections}

				</div>
			</div>
		);
	}
});



