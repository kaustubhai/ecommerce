import '../assets/Editor.scss'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import axios from 'axios'
import Loader from './Loader'

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    return (
        <Row className='d-flex justify-content-center align-items-center'>
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
                className={editor.isActive('bold') ? 'bg-white text-dark' : ''}
            >
                bold
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
                className={editor.isActive('italic') ? 'bg-white text-dark' : ''}
            >
                italic
            </Button>
            <Button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive('paragraph') ? 'bg-white text-dark' : ''}
            >
                para
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'bg-white text-dark' : ''}
            >
                h1
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'bg-white text-dark' : ''}
            >
                h2
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'bg-white text-dark' : ''}
            >
                h3
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={editor.isActive('heading', { level: 4 }) ? 'bg-white text-dark' : ''}
            >
                h4
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={editor.isActive('heading', { level: 5 }) ? 'bg-white text-dark' : ''}
            >
                h5
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={editor.isActive('heading', { level: 6 }) ? 'bg-white text-dark' : ''}
            >
                h6
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-white text-dark' : ''}
            >
                bullet list
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-white text-dark' : ''}
            >
                ordered list
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'bg-white text-dark' : ''}
            >
                <i class="fa fa-align-left"></i>
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'bg-white text-dark' : ''}
            >
                <i class="fa fa-align-center"></i>
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'bg-white text-dark' : ''}
            >
                <i class="fa fa-align-right"></i>
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({ textAlign: 'justify' }) ? 'bg-white text-dark' : ''}
            >
                <i class="fa fa-align-justify"></i>
            </Button>
        </Row>
    )
}

const ColorBar = ({ editor }) => {
    if (!editor) {
        return null
    }
    return (
        <Row className='mt-3 d-flex justify-content-center align-items-center'>
            <Button variant='secondary'
                onClick={() => editor.chain().focus().setColor('#FF0000').run()}
                className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
            >
                Red
            </Button>
            <Button variant='secondary'
                onClick={() => editor.chain().focus().setColor('#00FF00').run()}
                className={editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''}
            >
                Green
            </Button>
            <Button variant='secondary'
                onClick={() => editor.chain().focus().setColor('#0000FF').run()}
                className={editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''}
            >
                Blue
            </Button>
            <Button variant='secondary'
                onClick={() => editor.chain().focus().setColor('#FAF594').run()}
                className={editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''}
            >
                Yellow
            </Button>
            <Button variant='secondary'
                onClick={() => editor.chain().focus().setColor('#444444').run()}
                className={editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''}
            >
                Grey
            </Button>
            <Button variant='secondary'
                onClick={() => editor.chain().focus().setColor('#FFFFFF').run()}
                className={editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''}
            >
                White
            </Button>
            <Button variant='secondary'
                onClick={() => editor.chain().focus().setColor('#B9F18D').run()}
                className={editor.isActive('textStyle', { color: '#000000' }) ? 'is-active' : ''}
            >
                Black
            </Button>
        </Row>
    )
}

export default ({ dispatch }) => {

    const [uploading, setUploading] = useState(false)

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }

            const { data } = await axios.post('/api/upload', formData, config)

            if (data) {
                editor.chain().focus().setImage({ src: data }).run()
            }
            setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    const [content, setContent] = useState(`
    <h2>
      Hi there,
    </h2>
    <p>
      this is a <em>basic</em> example of your <strong>NEWSLETTER</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable.
    </p>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
  `)
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Dropcursor,
            TextStyle,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content,
    })

    return (
        <Form onSubmit={(e) => dispatch(e, JSON.stringify(editor.getHTML()))}>
            <MenuBar editor={editor} />
            <ColorBar editor={editor} />
            <Row className='p-3 my-3 border'>
                <EditorContent editor={editor} />
            </Row>
            <Row>
                <Col sm={12} md={4} className='d-flex justify-content-center'>
                    {/* <Button variant='secondary' className='mx-auto' onClick={addImage}>add image from URL</Button> */}
                </Col>
                <Col sm={12} md={4} className='d-flex justify-content-center'>
                    <Form.Group controlId='secondaryImage'>
                        <Form.Label>Upload an Image</Form.Label>
                        <Form.File
                            id='image-file-2'
                            label='Choose File'
                            custom
                            onChange={(event) => uploadFileHandler(event, 2)}
                        ></Form.File>
                        {uploading && <Loader />}
                    </Form.Group>
                </Col>
                <Col sm={12} md={4} className='d-flex justify-content-center'>
                    {/* <Button variant='secondary' className='mx-auto' onClick={addImage}>Reset Content</Button> */}
                </Col>
            </Row>
            <Row>
                <Col sm={3}></Col>
                <Col sm={6} className='d-flex justify-content-center'>
                    <Button block className='mx-auto' onClick={() => setContent('')} type='submit'>Send Newsletter</Button>
                </Col>
                <Col sm={3}></Col>
            </Row>
        </Form>
    )
}