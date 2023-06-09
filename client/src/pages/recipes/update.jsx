import { Modal, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import API from '../../services/api';
import RecipeViewEditor from './recipe-view-editor';

const ModalUpdate = ({ open, handler, id }) => {
    const updateRecipe = (recipe) => {
        handler(recipe);
    };

    const [recipe, setRecipe] = useState({});

    useEffect(() => {
        if (!id) return;
        API.getRecipe(id)
            .then((res) => {
                if (res.status === 200) {
                    setRecipe(res.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        return () => {};
    }, [id]);

    return (
        <Modal.Root opened={open} onClose={handler} size="xl">
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>
                        <Text fw={700} fz="lg">
                            Update Recipe
                        </Text>
                    </Modal.Title>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    <RecipeViewEditor
                        buttonText={'Update recipe'}
                        handler={updateRecipe}
                        APICall={API.updateRecipe}
                        recipe={recipe}
                    />
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
};

export default ModalUpdate;
