import React from 'react';
import ReactDOM from 'react-dom';
import createClass from 'create-react-class';
import './accordion.css';
import sparkNotes from './data/spark_notes.json'
import Parse from 'html-react-parser'


const App = createClass({
	
    render () {
        let data = [
          {
          title: "One", 
          content: `Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt 
                    ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit 
                    in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur 
                    sint occaecat cupidatat non proident, 
                    sunt in culpa qui officia deserunt 
                    mollit anim id est laborum.`
        }, {
          title: "Two", 
          content: `Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt 
                    ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit 
                    in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur 
                    sint occaecat cupidatat non proident, 
                    sunt in culpa qui officia deserunt 
                    mollit anim id est laborum.`
        },{
          title: "Three", 
          content: `Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt 
                    ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis 
                    nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. 
                    Duis aute irure dolor in reprehenderit 
                    in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur 
                    sint occaecat cupidatat non proident, 
                    sunt in culpa qui officia deserunt 
                    mollit anim id est laborum.`
        }
      ];
      
        return (
          <Accordion data={sparkNotes} />
      );
    }
  });
  
  const Accordion = createClass({
  
      componentWillMount () {
        let accordion = [];
      
        this.props.data.forEach((i) => {
        accordion.push({
          title: i.title, 
          content: i.content, 
          open: false
        });
      });
      
          this.setState({
        accordionItems: accordion
      });
    },
    
    click (i) {
        const newAccordion = this.state.accordionItems.slice();
      const index = newAccordion.indexOf(i)
      
      newAccordion[index].open = !newAccordion[index].open;
      this.setState({accordionItems: newAccordion});
    },
    
      render () {
      const sections = this.state.accordionItems.map((i) => (
        <div key={this.state.accordionItems.indexOf(i)}>
          <div 
            className="title" 
            onClick={this.click.bind(null, i)}
          >
           <div className="arrow-wrapper">
             <i className={i.open 
               ? "fa fa-angle-down fa-rotate-180" 
               : "fa fa-angle-down"}
             ></i>
           </div>
           <span className="title-text">
             {i.title}
           </span>
         </div>
         <div className={i.open 
           ? "content content-open" 
           : "content"}
          >
            <div className={i.open 
              ? "content-text content-text-open" 
              : "content-text"}
            > 
            {/* {console.log(i.content)} */}
            {contentList(i.content)}
            </div>
          </div>
        </div>
      ));
      
      return (
        <div className="accordion">
          {sections}
        </div>
      );
     }
  });

  function contentList(listItems) {
    return (
      <ul>{listItems.map(i =>(
        Parse(i)
      ))}</ul>
    )
  }
  
  ReactDOM.render(
    <App />, 
    document.getElementById('accordion')
  );