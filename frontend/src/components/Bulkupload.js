import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bulkUpload } from '../actions/productActions';
import Loader from './Loader';
import { Alert } from 'react-bootstrap';
const Bulkupload = ({ onCloseModal }) => {

    const dispatch = useDispatch();

    const onUpload = (e) => {
        setFile(e.target.files[0])
        const file = e.target.files
        if (file.length > 0) {
            var fileReader = new FileReader()
            fileReader.readAsDataURL(file[0])
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append('file', file)
        dispatch(bulkUpload(formData))
        // if (!error && !loading)
        // onCloseModal && onCloseModal()
    }

    const { loading, error, msg } = useSelector(state => state.bulkUpload)

    const [file, setFile] = useState('')
    return (
        <div className='pt-3 d-flex flex-column justify-content-center align-items-center'>
            {
                loading && <Loader />
            }
            {
                error && <Alert variant='danger'>{error}</Alert>
            }
            {
                msg && <Alert variant='success'>{msg}</Alert>
            }
            <form onSubmit={onSubmit}>
                <div className='form-group w-full'>
                    <label className='pb-3 text-center w-full' htmlFor='file'>Upload File</label>
                    <input
                        type='file'
                        className='form-control pb-3'
                        id='file'
                        onChange={onUpload}
                        accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                    />
                    <input type='submit' disabled={loading} className='btn btn-block btn-primary mt-3' />
                </div>
            </form>
        </div>
    )
}

export default Bulkupload