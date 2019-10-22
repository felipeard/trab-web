import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Card, CardText, CardTitle, CardActions, CardMenu, Button, Dialog, DialogTitle, DialogContent, DialogActions, Textfield, Spinner } from 'react-mdl';

const Content = ({ userId }) => {
  const [list, setList] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState();
  const [editingGrade, setEditingGrade] = useState();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if(userId) {
      setIsFetching(true);
      axios.post('http://192.168.15.26:5000/list', {id: userId})
        .then(res => {
          setList(res.data);
          setIsFetching(false);
        })
        .catch(err => {
          setIsFetching(false);
        });
    };
  }, [userId]);

  const handleSaveGrade = () => {
    if(editingGrade) {
      setIsFetching(true);
      axios.post('http://192.168.15.26:5000/vote', {id: userId, grade: editingGrade, term: editingItem.term})
        .then(res => {
          setList(list.map(item => item.term === editingItem.term ? ({...item, average: res.data, grade: editingGrade}) : item ));
          setIsFetching(false);
          setDialogOpen(false);
        })
        .catch(err => console.log(err));
    }
  }
  
  return (
    <div>
      { list && list.map((item, index) => (
        <Card key={index} shadow={0} style={{width: '512px', margin: 'auto', marginTop: '20px'}}>
          <CardTitle style={{ color: '#fff', height: '176px', background: `url(${item.image || 'http://www.getmdl.io/assets/demos/welcome_card.jpg'}) center / cover`}}>{`${item.term} ${item.secondaryTerm ? `(${item.secondaryTerm})` : ''}`}</CardTitle>
          <CardText>
            {item.definition}
          </CardText>
          <CardText>
            <a href={item.reference}>{`Referência: ${item.reference}`}</a>
          </CardText>
          <CardActions border>
            {item.grade !== -1 ? <span>{`Sua Nota: ${item.grade}`}</span> : <Button colored onClick={() => { setDialogOpen(true); setEditingItem(item); }}>Avalie</Button>}
          </CardActions>
          <CardMenu style={{color: '#fff'}}>
            <span>{`Média: ${item.average.toFixed(2)}`}</span>
          </CardMenu>
        </Card>
      ))}
      <Dialog open={dialogOpen}>
        <DialogTitle>Avalie</DialogTitle>
        {isFetching ? <div style={{display: 'flex', justifyContent: 'center', padding: '50px'}}><Spinner /></div> :
        (
          <Fragment>
            <DialogContent>
              <Textfield
                onChange={e => {setEditingGrade(e.target.value)}}
                label="Nota"
                floatingLabel
                style={{width: '200px'}}
              />
            </DialogContent>
            <DialogActions>
              <Button raised colored ripple type='button' onClick={() => handleSaveGrade(editingGrade)}>Salvar</Button>
              <Button type='button' onClick={() => setDialogOpen(false)}>Cancelar</Button>
            </DialogActions>
          </Fragment>
        )}
      </Dialog>
    </div>
  );
};

export default Content;