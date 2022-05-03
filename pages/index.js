import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { create } from 'ipfs-http-client';


//Escolha do Next.JS foi feita devido a caracteristica de multiplas paginas do projeto
//Aplicação funcional - ao invés de ser por classe

//cliente infura
const client = create('https://ipfs.infura.io:5001/api/v0')
  
  
export default function Home() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [ipfs_URL, setIpfs_URL] = useState(``);

  //funcao: lida com o arquivo selecionada pelo usuario
  //param: evento gerado pela entrada do arquivo
  //output: atualiza variavel de estado - recebendo o arquivo
  function fileSelectedHandler(e) {
    const file = e.target.files[0];

    return setSelectedFile(file);
  }
  
  //funcao assincrona: lida com o upload do arquivo selecionado para a rede IPFS
  //output: upload do arquivo selecionado para IPFS
  async function pinFiletoIPFS() {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
 
  data.append('file', selectedFile);

  const metadata = JSON.stringify({
    name: 'sand',
    keyvalues: {
      exampleKey: 'Lorem Ipsum 2x2 - _ -'
    }
    });
  data.append('pinataMetadata', metadata);
  
  axios.post(url, data, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: process.env.API_KEY_PINATA,
        pinata_secret_api_key: process.env.API_SECRET_KEY_PINATA
      }
      }).then((resp) => {
        setIpfs_URL(`https://ipfs.infura.io/ipfs/${resp.data.IpfsHash}`)
        console.log(ipfs_URL);
      }).catch((error) => {
        console.log(error)
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.h2}>
        <h2>Upload your file to the Interplanetary File System and pin it on Pinata</h2>
      </div>
      <div className={styles.card}>
        {
          ipfs_URL && (
            <img src={ipfs_URL} width="100px" />
          )
        }
      </div>
      <div className={styles.input}>
        <input type={'file'} onChange={fileSelectedHandler}/>
      </div>
      <div>
        <button type="button" className="btn btn-primary" onClick={pinFiletoIPFS}>Pin file into Pinata!</button>
      </div>
      <div>
        <p>{ipfs_URL}</p>
      </div>
    </div>
  )
}