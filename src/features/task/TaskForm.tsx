import { css } from '@emotion/react';
import { Add, Save } from '@mui/icons-material';
import {
  Button,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React, { ChangeEvent, FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'redux/hooks';
import {
  editTask,
  fetchAsyncCreateCategory,
  fetchAsyncCreateTask,
  fetchAsyncUpdateTask,
  initialState,
  selectCategory,
  selectEditedTask,
  selectTask,
  selectUsers,
} from './taskSlice';

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}`,
    left: `${left}`,
    transform: `transform(-${top}%, -${left}%)`,
  };
};

export const TaskForm: FC = () => {
  const dispatch = useAppDispatch();

  const users = useSelector(selectUsers);
  const category = useSelector(selectCategory);
  const editedTask = useSelector(selectEditedTask);

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [inputText, setInputText] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const isDisabled =
    editedTask.task.length === 0 || editedTask.description.length === 0 || editedTask.criteria.length === 0;
  const isCatDisabled = inputText.length === 0;

  const handleInputTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let targetValue: string | number = e.target.value;
    const name = e.target.value;
    if (name === 'estimate') targetValue = Number(targetValue);
    dispatch(editTask({ ...editedTask, [name]: targetValue }));
  };

  const handleSelectRespChange = (e: SelectChangeEvent<number>) => {
    const targetValue = e.target.value as number;
    dispatch(editTask({ ...editedTask, responsible: targetValue }));
  };

  const handleSelectStatusChange = (e: SelectChangeEvent<string>) => {
    const targetValue = e.target.value;
    dispatch(editTask({ ...editedTask, status: targetValue }));
  };

  const handleSelectCatChange = (e: SelectChangeEvent<number>) => {
    const targetValue = e.target.value as number;
    dispatch(editTask({ ...editedTask, category: targetValue }));
  };

  const userOptions = users.map((user) => (
    <MenuItem value={user.id} key={user.id}>
      {user.username}
    </MenuItem>
  ));

  const catOptions = category.map((cat) => (
    <MenuItem value={cat.id} key={cat.id}>
      {cat.item}
    </MenuItem>
  ));

  return (
    <div>
      <form>
        <TextField
          css={SField}
          label="Estimate [days]"
          type="number"
          name="estimate"
          InputProps={{ inputProps: { min: 0, max: 1000 } }}
          InputLabelProps={{
            shrink: true,
          }}
          value={editedTask.estimate}
          onChange={handleInputChange}
        />
        <TextField
          css={SField}
          InputLabelProps={{
            shrink: true,
          }}
          label="Task"
          type="text"
          name="task"
          value={editedTask.task}
          onChange={handleInputChange}
        />
        <br />
        <TextField
          css={SField}
          InputLabelProps={{
            shrink: true,
          }}
          label="Description"
          type="text"
          name="description"
          value={editedTask.description}
          onChange={handleInputChange}
        />
        <TextField
          css={SField}
          InputLabelProps={{
            shrink: true,
          }}
          label="Criteria"
          type="text"
          name="criteria"
          value={editedTask.criteria}
          onChange={handleInputChange}
        />
        <br />
        <FormControl css={SField}>
          <InputLabel>Responsible</InputLabel>
          <Select name="responsible" onChange={handleSelectRespChange} value={editedTask.responsible}>
            {userOptions}
          </Select>
        </FormControl>
        <FormControl css={SField}>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={editedTask.status} onChange={handleSelectStatusChange}>
            <MenuItem value={1}>Not started</MenuItem>
            <MenuItem value={2}>On going</MenuItem>
            <MenuItem value={3}>Done</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl css={SField}>
          <InputLabel>Category</InputLabel>
          <Select name="category" value={editedTask.category} onChange={handleSelectCatChange}>
            {catOptions}
          </Select>
        </FormControl>

        <Fab size="small" color="primary" onClick={handleOpen} css={SAddIcon}>
          <Add />
        </Fab>

        <Modal open={open} onClose={handleClose}>
          <div style={modalStyle} css={SPaper}>
            <TextField
              css={SField}
              InputLabelProps={{
                shrink: true,
              }}
              label="New category"
              type="text"
              value={inputText}
              onChange={handleInputTextChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              css={SSaveModal}
              startIcon={<Save />}
              disabled={isCatDisabled}
              onClick={() => {
                void dispatch(fetchAsyncCreateCategory(inputText));
                handleClose();
              }}
            >
              SAVE
            </Button>
          </div>
        </Modal>
        <br />
        <Button
          variant="contained"
          color="primary"
          size="small"
          css={SButton}
          startIcon={<Save />}
          disabled={isDisabled}
          onClick={
            editedTask.id !== 0
              ? () => dispatch(fetchAsyncUpdateTask(editedTask))
              : () => dispatch(fetchAsyncCreateTask(editedTask))
          }
        >
          {editedTask.id !== 0 ? 'Update' : 'Save'}
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            dispatch(editTask(initialState.editedTask));
            dispatch(selectTask(initialState.selectedTask));
          }}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
};

const SField = css`
  margin: 1em;
  min-width: 15em;
`;
const SButton = css`
  margin: 1.5em;
`;
const SAddIcon = css`
  margin-top: 1.5em;
  margin-left: 1em;
`;
const SSaveModal = css`
  margin-top: 2em;
  margin-left: 1em;
`;
const SPaper = css`
  position: 'absolute';
  text-align: center;
  width: 400;
  /* background-color: pap; */
  /* box-shadow: ; */
  padding: 0.125em 0.25em 0.1875em;
`;
