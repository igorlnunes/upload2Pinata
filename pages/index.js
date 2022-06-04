import React, { useState } from 'react';
// import styles from '../styles/Home.module.css'
import 'semantic-ui-css/semantic.min.css'
import { create } from 'ipfs-http-client';
import { Button } from 'semantic-ui-react'


/*
Aplicação deve ter espacos para colocar:
i) O nome do arquivo;
ii) A descrição da image;
iii) Escolher o arquivo;
Depois de clicar no upload:
iv) Criar um arquivo json com o nome(nomedoarquivo.json);
v) Fazer o upload para o ipfs da imagem e do arquivo json
*/

//como os oustros fazem

//Escolha do Next.JS foi feita devido a caracteristica de multiplas paginas do projeto
//Aplicação funcional - ao invés de ser por classe

//cliente infura
const client = create('https://ipfs.infura.io:5001/api/v0')
  

export default function CreateNFT() {
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [metaUrl, setMetaUrl] = useState(null);
  const [formInput, setFormInput] = useState({ name: '', description: ''});

  async function onChange(e) {
    //captura o arquivo
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`Recebido: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setSelectedUrl(url);
      console.log(selectedUrl);
    } catch (error) {
      console.log('Erro no upload do arquivo: ', error);

    }
  }

  async function uploadIPFS() {
    const { name, description } = formInput;
    if(!name || !description || !selectedUrl) return

    //fazer primeiro o upload no IPFS
    const data = JSON.stringify({
      name: formInput.name, description: formInput.description, 
      about: 'Esta colecao é de teste. IgorNunes', imagem: selectedUrl
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      //depois do upload no ipfs retorna o URL para usar
      setMetaUrl(url);
      console.log(metaUrl);
    } catch(error) {
      console.log('Erro no upload da metadata: ', error);
    }
  }

  return (
    <div className="columns-2 flex justify-center bg-zinc-600 h-screen p-16">
        <div>
          <h2 className="text-3xl lg:text-5xl font-bold text-pink-400 p-4 m-8">
            Upload your image to the<br/>Interplanetary File System<br/>
            and pin it on Pinata
          </h2>
          {
            selectedUrl && (
              <img src={selectedUrl} width="100px" />
            )
          }
          <div>{metaUrl}</div>
      </div>
      <div className='w-1/3 flex flex-col justify-center pt-4 pb-4 h-full'>
          <input
            type='text'
            required
            maxLength='16'
            placeholder='File Name'
            className='border rounded p-4'
            onChange={e => setFormInput({ ...formInput, name: e.target.value })}
          />
          <textarea
            placeholder='File Description'
            required
            maxLength='256'
            className='mt-8 border rounded p-4'
            onChange={e => setFormInput({ ...formInput, description: e.target.value })}
          />
          <input
            className='mt-4 mb-4 border rounded p-4'
            type="file"
            name="lore"
            accept='.jpg, .jpeg, .png'
            onChange={onChange}
          />   
            <Button color='violet' onClick={uploadIPFS}>Pin Image Into Pinata</Button>    
      </div>
    </div>
    )
  }