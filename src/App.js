import React, {Component} from 'react';
import {SketchField, Tools} from 'react-sketch';
import {
    AppBar,
    Card,
    CardHeader,
    CardText,
    GridList,
    GridTile,
    IconButton,
    MenuItem,
    RaisedButton,
    SelectField,
    Slider,
    TextField,
    Toggle,
    ToolbarSeparator
} from 'material-ui';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import RedoIcon from 'material-ui/svg-icons/content/redo';
import ClearIcon from 'material-ui/svg-icons/action/delete';
import SaveIcon from 'material-ui/svg-icons/content/save';

const styles = {
    root: {
        padding: '3px',
        display: 'flex',
        flexWrap: 'wrap',
        margin: '10px 10px 5px 10px',
        justifyContent: 'space-around'
    },
    gridList: {
        width: '100%',
        overflowY: 'auto',
        marginBottom: '24px'
    },
    gridTile: {
        backgroundColor: '#fcfcfc'
    },
    appBar: {
        backgroundColor: '#333'
    },
    radioButton: {
        marginTop: '3px',
        marginBottom: '3px'
    },
    separator: {
        height: '42px',
        backgroundColor: 'white'
    },
    iconButton: {
        fill: 'white',
        width: '42px',
        height: '42px'
    },
    dropArea: {
        width: '100%',
        height: '64px',
        border: '2px dashed rgb(102, 102, 102)',
        borderStyle: 'dashed',
        borderRadius: '5px',
        textAlign: 'center',
        paddingTop: '20px'
    },
    activeStyle: {
        borderStyle: 'solid',
        backgroundColor: '#eee'
    },
    rejectStyle: {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd'
    }
};

class App extends Component {
    state = {
        tool: Tools.Pencil,
        lineWidth: 5,
        drawings: [],
        canUndo: false,
        canRedo: false,
    };

    selectTool (even, index, value) {
        this.setState({
            tool: value
        });
    }

    onSketchChange = () => {
        let prev = this.state.canUndo;
        let now = this._sketch.canUndo();
        if (prev !== now) {
            this.setState({canUndo: now});
        }
    };

    save () {
        let drawings = this.state.drawings;
        drawings.push(this._sketch.toDataURL());

        this.setState({drawings: drawings});
    }

    undo () {
        this._sketch.undo();

        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo(),
        })
    }

    redo () {
        this._sketch.redo();

        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo(),
        })
    }

    clear = () => {
        this._sketch.clear();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div>
                    <div className='row'>
                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                            <AppBar title='Pie Piper' showMenuIconButton={false} style={styles.appBar}>
                                <IconButton
                                    onClick={this.undo.bind(this)}
                                    iconStyle={styles.iconButton}
                                    disabled={!this.state.canUndo}>
                                    <UndoIcon/>
                                </IconButton>
                                <IconButton
                                    onClick={this.redo.bind(this)}
                                    iconStyle={styles.iconButton}
                                    disabled={!this.state.canRedo}>
                                    <RedoIcon/>
                                </IconButton>
                                <ToolbarSeparator style={styles.separator}/>
                                <IconButton
                                    onClick={this.save.bind(this)}
                                    iconStyle={styles.iconButton}>
                                    <SaveIcon/>
                                </IconButton>
                                <ToolbarSeparator style={styles.separator}/>
                                <IconButton
                                    onClick={this.clear.bind(this)}
                                    iconStyle={styles.iconButton}>
                                    <ClearIcon/>
                                </IconButton>
                            </AppBar>
                        </div>
                    </div>

                    <div style={{border: '10px solid black', height: '1034px', width: '1034px', borderColor: 'black'}}>
                        <SketchField
                            ref={(c) => this._sketch = c}
                            width='1024px'
                            height='1024px'
                            tool={this.state.tool}
                            lineColor='black'
                            lineWidth={this.state.lineWidth}
                            imageFormat="jpeg"
                            onChange={this.onSketchChange.bind(this)}
                        />
                    </div>


                    <Card style={{margin: '10px 10px 5px 0'}}>

                        <CardText expandable={false}>
                            <label htmlFor='tool'>Canvas Tool</label><br/>
                            <SelectField ref='tool' value={this.state.tool} onChange={this.selectTool.bind(this)}>
                                <MenuItem value={Tools.Select} primaryText="Select"/>
                                <MenuItem value={Tools.Pencil} primaryText="Pencil"/>
                                <MenuItem value={Tools.Line} primaryText="Line"/>
                                <MenuItem value={Tools.Rectangle} primaryText="Rectangle"/>
                                <MenuItem value={Tools.Circle} primaryText="Circle"/>
                                <MenuItem value={Tools.Pan} primaryText="Pan"/>
                            </SelectField>
                            <br/>
                            <br/>
                            <br/>
                            <label htmlFor='slider'>Line Weight</label>
                            <Slider ref='slider' step={0.1}
                                    defaultValue={this.state.lineWidth / 100}
                                    onChange={(e, v) => this.setState({lineWidth: v * 100})}/>
                        </CardText>
                    </Card>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
