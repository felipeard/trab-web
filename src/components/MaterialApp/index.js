import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { Navigation, Layout, Header, Drawer, Dialog, DialogTitle, DialogActions, DialogContent, Button, Textfield, Snackbar, Spinner } from 'react-mdl';
import Content from '../Content';

const MenuBar = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [userId, setUserId] = useState();
  const [snackbar, setSnackbar] = useState('');

  const handleLogin = () => {
    setIsFetching(true);
    axios.post('http://192.168.15.26:5000/login', {username, password})
      .then(res => {
        setIsFetching(false);
        setUserId(res.data);
        setDialogOpen(false);
        setSnackbar('Login realizado com sucesso!');
      })
      .catch(err => {
        setIsFetching(false);
        setSnackbar('Usuário/Senha incorreto(s)');
      });
  }
  
  return (
    <div style={{height: '100vh', position: 'relative'}}>
      <Layout fixedHeader>
        <Header title="Glossário de Conceitos">
          {
            userId ? <span>{`Olá, ${username}`}</span>
            : (
              <Navigation>
                <span onClick={() => setDialogOpen(true)}>Login</span>
              </Navigation>
            )
          }
          
        </Header>
        <Drawer title="Menu">
          {
            userId && ( 
            <Navigation>
              <span onClick={() => setDialogOpen(true)}>Login</span>
            </Navigation>)
          }
        </Drawer>
        <Content userId={userId}/>
        <Dialog open={dialogOpen}>
        <DialogTitle>Login</DialogTitle>
          {
            isFetching ? <div style={{display: 'flex', justifyContent: 'center', padding: '50px'}}><Spinner /></div> :
            <Fragment>
              <DialogContent>
                <Textfield
                  onChange={e => setUsername(e.target.value)}
                  label="Usuário"
                  floatingLabel
                  style={{width: '200px'}}
                />
                <Textfield
                  onChange={e => {setPassword(e.target.value)}}
                  label="Senha"
                  type="password"
                  floatingLabel
                  style={{width: '200px'}}
                />
              </DialogContent>
              <DialogActions>
                <Button raised colored ripple type="button" onClick={() => handleLogin()}>Login</Button>
                <Button type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
              </DialogActions>
            </Fragment>
          }
        </Dialog>
        <Snackbar
          active={snackbar.length}
          onTimeout={() => setSnackbar('')}
        >
          {snackbar}
        </Snackbar>
      </Layout>
    </div>
  )
}

export default MenuBar;