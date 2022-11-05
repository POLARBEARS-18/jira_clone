import { css } from '@emotion/react';
import { AddCircleOutline, DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import { Avatar, Badge, Button, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { selectLoginUser, selectProfiles } from 'features/auth/authSlice';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'redux/hooks';
import { ReadTask, SortState } from 'types/types';
import { editTask, fetchAsyncDeleteTask, initialState, selectTask, selectTasks } from './taskSlice';

export const TaskList: FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useSelector(selectTasks);
  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);
  const columns = tasks[0] && Object.keys(tasks[0]);

  const [state, setState] = useState<SortState>({
    rows: tasks,
    order: 'desc',
    activeKey: '',
  });

  const handleClickSortColumn = (column: keyof ReadTask) => {
    const isDesc = column === state.activeKey && state.order === 'desc';
    const newOrder = isDesc ? 'asc' : 'desc';
    const sortedRows = Array.from(state.rows).sort((a, b) => {
      if (a[column] > b[column]) {
        return newOrder === 'asc' ? 1 : -1;
      }
      if (a[column] < b[column]) {
        return newOrder === 'asc' ? -1 : 1;
      }
      return 0;
    });

    setState({
      rows: sortedRows,
      order: newOrder,
      activeKey: column,
    });
  };

  useEffect(() => {
    setState((states) => ({
      ...states,
      rows: tasks,
    }));
  }, [tasks]);

  const renderSwitch = (statusName: string) => {
    switch (statusName) {
      case '未着手':
        return (
          <Badge variant="dot" color="error">
            {statusName}
          </Badge>
        );
      case '着手中':
        return (
          <Badge variant="dot" color="primary">
            {statusName}
          </Badge>
        );
      case '完了':
        return (
          <Badge variant="dot" color="secondary">
            {statusName}
          </Badge>
        );
      default:
        return null;
    }
  };

  const conditionalSrc = (user: number) => {
    const loginProfile = profiles.filter((prof) => prof.user_profile === user)[0];
    return loginProfile?.img !== null ? loginProfile?.img : undefined;
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(
            editTask({
              id: 0,
              task: '',
              description: '',
              criteria: '',
              responsible: loginUser.id,
              status: '1',
              category: 1,
              estimate: 0,
            })
          );
          dispatch(selectTask(initialState.selectedTask));
        }}
        color="primary"
        size="small"
        startIcon={<AddCircleOutline />}
        css={SButton}
      >
        Add new
      </Button>
      {tasks[0].task && (
        <Table size="small" css={STable}>
          <TableHead>
            <TableRow>
              {columns.map(
                (column) =>
                  (column === 'task' ||
                    column === 'status' ||
                    column === 'category' ||
                    column === 'estimate' ||
                    column === 'responsible' ||
                    column === 'owner') && (
                    <TableCell align="center" key={column}>
                      <TableSortLabel
                        active={state.activeKey === column}
                        direction={state.order}
                        onClick={() => handleClickSortColumn(column)}
                      >
                        <strong>{column}</strong>
                      </TableSortLabel>
                    </TableCell>
                  )
              )}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {state.rows.map((row) => (
              <TableRow hover key={row.id}>
                {Object.keys(row).map(
                  (key) =>
                    (key === 'task' || key === 'status_name' || key === 'category_item' || key === 'estimate') && (
                      <TableCell
                        key={`${row.id}+${key}`}
                        onClick={() => {
                          dispatch(selectTask(row));
                          dispatch(editTask(initialState.editedTask));
                        }}
                        align="center"
                        css={STaskListHover}
                      >
                        {key === 'status_name' ? renderSwitch(row[key]) : <span>{row[key]}</span>}
                      </TableCell>
                    )
                )}
                <TableCell>
                  <Avatar src={conditionalSrc(row.responsible)} alt="resp" css={SSmall} />
                </TableCell>
                <TableCell>
                  <Avatar src={conditionalSrc(row.owner)} alt="owner" css={SSmall} />
                </TableCell>

                <TableCell align="center">
                  <button
                    type="button"
                    onClick={() => {
                      void dispatch(fetchAsyncDeleteTask(row.id));
                    }}
                    disabled={row.owner !== loginUser.id}
                    css={STaskListIcon}
                  >
                    <DeleteOutlineOutlined />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void dispatch(editTask(row));
                    }}
                    disabled={row.owner !== loginUser.id}
                    css={STaskListIcon}
                  >
                    <EditOutlined />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

const STable = css`
  table-layout: fixed;
`;
const SButton = css`
  margin: 1.5em;
`;
const STaskListHover = css`
  cursor: pointer;
`;
const STaskListIcon = css`
  cursor: pointer;
`;

const SSmall = css`
  margin: auto;
  width: 1.5em;
  height: 1.5em;
`;
