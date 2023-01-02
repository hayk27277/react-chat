import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';


const useStyles = makeStyles({
    messageArea: {
        height: '70vh',
        width: '100%',
        overflowY: 'auto'
    }
});

export const MessagesPanel = (props) => {
    const [state, setState] = useState({input_value: ''})
    const {
        onSendMessage,
        channel,
        user,
    } = props

    const classes = useStyles();


    const send = () => {
        if (state.input_value && state.input_value !== '') {
            onSendMessage(channel.id, state.input_value);
            setState({input_value: ''});
        }
    }


    useEffect(() => {
        scrollToBottom()
    }, [channel])

    const handleInput = e => {
        setState({input_value: e.target.value});
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            send()
        }
    }

    let messagesEnd;

    const scrollToBottom = () => {
        messagesEnd.scrollIntoView({behavior: "smooth"});
    }

    let list = <div className="no-content-message">There is no messages to show</div>;

    if (channel && channel.messages) {
        list = channel.messages.slice(0).reverse().map(m =>
            <ListItem key={m.id} id={m.id}>
                <Grid container>
                    <Grid item xs={12}>
                        <ListItemText align={m.sender_id === user.id ? "right" : "left"}
                                      primary={m.message}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                        <ListItemText align={m.sender_id === user.id ? "right" : "left"}
                                      secondary={m.send_at}></ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
        )
    }

    return (
        <div className='messages-panel'>
            <List className={classes.messageArea}>
                {list}
                <div style={{float: "left", clear: "both"}}
                     ref={(el) => {
                         messagesEnd = el;
                     }}>
                </div>
            </List>
            <Divider/>
            {channel &&
                <Grid container style={{padding: '20px'}}>
                    <Grid item xs={11}>
                        <TextField id="outlined-basic-email"
                                   onChange={handleInput}
                                   value={state.input_value}
                                   onKeyPress={handleKeyPress}
                                   label="Type Something" fullWidth/>
                    </Grid>
                    <Grid xs={1} align="right">
                        <Fab color="primary" aria-label="add" onClick={send}><SendIcon/></Fab>
                    </Grid>
                </Grid>
            }
        </div>
    );
}
