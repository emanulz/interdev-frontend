import React, {Component} from 'react'
import {connect} from 'react-redux'

@connect((store, ownProps)=>{
    return {
        
    }
})
class DragANDdrop extends Component{


    /**
     * If more than one item is contained within the element that has the event listeners, its own childrens will fire the events
     * causing multiple events that we don't want to react to. Imagine the cursor going in these pipes --> |||| , when the first
     * one is touched we increase to one the counter. If the mouse is now moving right to left, we decrease the drag_depth.
     *  Only react on change from 1 to zero and zero to one.
     */

    state = {
        depth_counter: 0,
        dragActive: false,
        windowOverriden: false,
        files: []
    }

    constructor(props){
        super(props)
        this.dropReference = React.createRef()

    }
    //reference for the element which the events will be refered to
    //dropReference = null

    static_counter = (e)=>{
        if (typeof static_counter.depth == 'undefined'){
            static_counter.depth = 0
        }
        if(e === 1){
            static_counter.depth += 1
        }else{
            static_counter.depth -= 1
        }
        return static_counter.depth
    }

    overrideEventDefaults(e){
 
        e.preventDefault()
        e.stopPropagation()

    }
    componentDidMount(){

        window.addEventListener('drop', (e)=>{
            this.overrideEventDefaults(e)
        })
        window.addEventListener('dragover', (e)=>{
            this.overrideEventDefaults(e)
        })

        if (this.dropReference.current == null){
            this.dropReference = React.createRef()

        }
        let target_div = this.dropReference.current
        if(target_div == null){
            return
        }
        //add the event listerners that will be used to handle the process
        
        //reset the drag depth counter to zero

        this.depth_counter = 0
        target_div.addEventListener('dragover', this.handleObjectHovering)
        target_div.addEventListener('dragenter', this.handleDragStart)
        target_div.addEventListener('dragleave', this.handleDragEnd)
        target_div.addEventListener('drop', this.handleNuke)


    }

    //holy crap...what a mess with no unbinding
    componentWillUnmount(){

        let target_div = this.dropReference.current
        if(target_div == null){
            return
        }
        
        window.removeEventListener('drop', this.overrideEventDefaults)
        window.removeEventListener('dragover', this.overrideEventDefaults)

        target_div.removeEventListener('dragover', this.handleObjectHovering)
        target_div.removeEventListener('dragenter', this.handleDragStart)
        target_div.removeEventListener('dragleave', this.handleDragEnd)
        target_div.removeEventListener('drop', this.handleNuke)
        
    }
 

    //functions to handle the drag and drop events

    handleObjectHovering = (e) => {

        e.preventDefault() //don't open it chrome...
        e.stopPropagation() // hush hush my childs...
    }

    handleDragStart = (e) => {
        e.preventDefault() //don't open it chrome...
        e.stopPropagation() // hush hush my childs...
        //increase the drag dept
        this.depth_counter++
        if(e.dataTransfer.files){ //check if there is a files object in the event
            //console.log("Files --> ", e.originalEvent.dataTransfer.files[0])
            this.setState({dragActive:true})
           }

    }

    handleDragEnd = (e) => {
        e.preventDefault() //don't open it chrome...
        e.stopPropagation() // hush hush my childs...
        this.depth_counter--
        //exit early if the depth in the container is more than zero elements
        if(this.depth_counter > 0) return
        this.setState({dragActive:false})

    }

    handleNuke = (e) => {
        e.preventDefault() //don't open it chrome...
        e.stopPropagation() // hush hush my childs...
        this.setState({dragActive:false})
        if (e.dataTransfer.files){
            if (e.dataTransfer.files.length >0){
                this.props.handleDrop(e.dataTransfer.files)
                this.depth_counter = 0
            }
        }

    }

    render() {
        let main_container_active_class = "dnd-container"
        let content = <div className="dnd-container-body">
            Arrastre y suelte los archivos XML
        </div>
        if(this.state.dragActive){
            main_container_active_class = "dnd-container dragging"
            content = <div className="dnd-container-body">
                    Suelte los archivos
                </div>
        }
        return <div className={main_container_active_class} ref={this.dropReference}>
            {content}
            {this.props.children}
        </div>

    }
}

export default DragANDdrop