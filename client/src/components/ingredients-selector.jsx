import { Modal, Button, Text, Group, Grid, TextInput, ScrollArea } from '@mantine/core';
import SelectorItem from './select-item';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import API from '../services/api';
import setNotification from '../pages/errors/error-notification';
import ModalCreateIngredient from '../pages/ingredients/create';

const ModalIngredientsSelector = ({ opened, handleClose, handleSubmit, already, ...props }) => {
    const [ingredients, setIngredients] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [search, setSearch] = useState('');
    let resIngredients = [];

    const clickHandler = (ingredient) => {
        if (props.multi) {
            // eslint-disable-next-line eqeqeq
            const indexIngredient = resIngredients.findIndex((item) => item._id == ingredient._id);
            if (indexIngredient === -1) {
                resIngredients.push(ingredient);
            } else {
                resIngredients.splice(indexIngredient, 1);
            }
        } else {
            handleSubmitLocal(ingredient);
        }
    };

    const handleSubmitLocal = (ingredient) => {
        handleSubmit(props.multi ? resIngredients : ingredient);
        handleClose();
    };

    useEffect(() => {
        API.listIngredients()
            .then((res) => {
                if (res.status === 200) {
                    setIngredients(res.data);
                }
            })
            .catch((err) => {
                setNotification(true, err.response.data.error);
            });

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (search.length >= 2) {
            API.searchIngredient(search)
                .then((res) => {
                    if (res.status === 200) {
                        setIngredients(res.data);
                    }
                })
                .catch((err) => {
                    setNotification(true, err.response.data.error);
                });
        } else if (search.length === 0) {
            API.listIngredients()
                .then((res) => {
                    if (res.status === 200) {
                        setIngredients(res.data);
                    }
                })
                .catch((err) => {
                    setNotification(true, err.response.data.error);
                });
        }
    }, [search]);

    return (
        <Modal.Root opened={opened} onClose={handleClose} size="lg">
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>
                        <Text fw={700} fz="lg">
                            Select Ingredient{props.multi ? 's' : ''}
                        </Text>
                    </Modal.Title>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <TextInput
                        placeholder="Type to Search"
                        mb="sm"
                        radius="md"
                        onChange={(e) => setSearch(e.target.value)}
                        icon={<IconSearch size="1rem" stroke={1.5} />}
                    />
                    <ScrollArea h={430} offsetScrollbars>
                        <Grid columns={3}>
                            {ingredients
                                .filter((ingredient) => !already?.includes(ingredient._id) ?? true)
                                .map((ingredient) => (
                                    <SelectorItem
                                        ingredient={ingredient}
                                        clickHandler={clickHandler}
                                        key={ingredient._id}
                                    />
                                ))}
                        </Grid>
                    </ScrollArea>
                    <Group position="right" mt="md">
                        {props.multi && (
                            <>
                                <Button variant="light" color="gray" onClick={() => setShowCreate(true)}>
                                    Create Ingredient
                                </Button>
                                <Button variant="light" color="red" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="light" color="green" onClick={() => handleSubmitLocal()}>
                                    Validate
                                </Button>
                            </>
                        )}
                    </Group>
                    {showCreate && (
                        <ModalCreateIngredient
                            opened={showCreate}
                            handler={() => setShowCreate(false)}
                            addIngredient={(ingredient) => setIngredients((prev) => [...prev, ingredient])}
                        />
                    )}
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
};

export default ModalIngredientsSelector;
