import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, Button, Chip, Typography, Box } from '@mui/material';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';
import type { Theme } from '@mui/material/styles';
import type { DatosCorreo } from '../../types';
import { RichTextEditor, MenuControlsContainer, MenuSelectFontFamily, MenuSelectHeading, MenuSelectTextAlign, MenuDivider, MenuButtonBold, MenuButtonItalic, MenuButtonUnderline, MenuButtonStrikethrough, MenuButtonTextColor, MenuButtonHighlightColor, MenuButtonOrderedList, MenuButtonBulletedList, MenuButtonRemoveFormatting, MenuButtonUndo, MenuButtonRedo } from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import {TextStyle} from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';

interface EmailModalProps {
    open: boolean;
    onClose: () => void;
    onSend: (datos: DatosCorreo) => Promise<void> | void;
    selectedFolios?: string[];
    loading?: boolean;
}

export default function EmailModal({ open, onClose, onSend, selectedFolios = [], loading = false }: EmailModalProps) {
    const [form, setForm] = useState<DatosCorreo>({ destinatarios: '', asunto: '', mensaje: '', cc: '', cco: '' });
    const [errors, setErrors] = useState<{ destinatarios?: string; asunto?: string } >({});
    const [editorContent, setEditorContent] = useState(form.mensaje || '');

    const validate = () => {
        const nextErrors: typeof errors = {};
        if (!form.destinatarios.trim()) nextErrors.destinatarios = 'Destinatarios es requerido';
        if (!form.asunto.trim()) nextErrors.asunto = 'Asunto es requerido';
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (key: keyof DatosCorreo) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleSend = async () => {
        if (!validate()) return;
        await onSend({ ...form, mensaje: editorContent });
    };

    useEffect(() => {
        if (open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEditorContent(form.mensaje || '');
        }
    }, [open, form.mensaje]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: (theme) => ({
                    backgroundImage: 'radial-gradient(ellipse at 50% 01%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                    ...theme.applyStyles('dark', {
                        backgroundImage: 'radial-gradient(at 50% 01%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                    }),
                }),
            }}
        >
            <DialogTitle sx={{ pb: 1.5, fontWeight: 700 }}>Enviar documentos por correo</DialogTitle>
            <DialogContent sx={{ pt: 1, pb: 0 }}>
                {selectedFolios.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                        {selectedFolios.map(f => (
                            <Chip key={f} label={`Folio: ${f}`} size="small" />
                        ))}
                    </Stack>
                )}
                {selectedFolios.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        No hay documentos seleccionados.
                    </Typography>
                )}
                <Stack spacing={2.5}>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle2" color="text.secondary">Destinatarios</Typography>
                        <TextField
                            placeholder="correo@ejemplo.com; otro@ejemplo.com"
                            value={form.destinatarios}
                            onChange={handleChange('destinatarios')}
                            error={!!errors.destinatarios}
                            helperText={errors.destinatarios}
                            fullWidth
                            size="small"
                            sx={(theme) => ({
                                '& .MuiInputBase-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    }),
                                    borderRadius: 1,
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: (theme.vars || theme).palette.text.secondary,
                                    opacity: 0.8,
                                },
                            })}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">CC</Typography>
                            <TextField
                                value={form.cc}
                                onChange={handleChange('cc')}
                                fullWidth
                                size="small"
                                sx={(theme) => ({
                                    '& .MuiInputBase-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        ...theme.applyStyles('dark', {
                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        }),
                                        borderRadius: 1,
                                    },
                                })}
                            />
                        </Stack>
                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">CCO</Typography>
                            <TextField
                                value={form.cco}
                                onChange={handleChange('cco')}
                                fullWidth
                                size="small"
                                sx={(theme) => ({
                                    '& .MuiInputBase-root': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                        ...theme.applyStyles('dark', {
                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        }),
                                        borderRadius: 1,
                                    },
                                })}
                            />
                        </Stack>
                    </Stack>
                    <Stack spacing={0.5}>
                        <Typography variant="subtitle2" color="text.secondary">Asunto</Typography>
                        <TextField
                            value={form.asunto}
                            onChange={handleChange('asunto')}
                            error={!!errors.asunto}
                            helperText={errors.asunto}
                            fullWidth
                            size="small"
                            sx={(theme) => ({
                                '& .MuiInputBase-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    }),
                                    borderRadius: 1,
                                },
                            })}
                        />
                    </Stack>
                    <RichTextEditor
                        extensions={[
                            StarterKit,
                            TextStyle,
                            Color,
                            Highlight.configure({ multicolor: true }),
                            FontFamily,
                            TextAlign.configure({ types: ['heading', 'paragraph'] }),
                        ]}
                        sx={(theme: Theme) => ({
                            minHeight: '240px',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            ...theme.applyStyles('dark', {
                                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                            }),
                            border: '1px solid',
                            borderColor: (theme.vars || theme).palette.divider,
                            borderRadius: 1,
                            '& .ProseMirror': {
                                backgroundColor: 'transparent',
                                color: (theme.vars || theme).palette.text.primary,
                                padding: theme.spacing(2),
                            },
                            '& .MuiTiptap-RichTextField-menuBarContent': {
                                backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                }),
                            },
                            '& .MuiTiptap-FieldContainer-root .MuiTiptap-RichTextField-menuBarContent': {
                                backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                }),
                            },
                            '& .MuiTiptap-MenuBar-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                ...theme.applyStyles('dark', {
                                    backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                }),
                            },
                        })}
                        content={editorContent}
                        onUpdate={({ editor }) => setEditorContent(editor.getHTML())}
                        renderControls={() => (
                            <MenuControlsContainer
                                sx={(theme) => ({
                                    backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                    ...theme.applyStyles('dark', {
                                        backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                    }),
                                    color: (theme.vars || theme).palette.text.primary,
                                    border: '1px solid',
                                    borderColor: (theme.vars || theme).palette.divider,
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                    '& .MuiTiptap-MenuBar-content': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.6) !important',
                                        ...theme.applyStyles('dark', {
                                            backgroundColor: 'rgba(0, 0, 0, 0.4) !important',
                                        }),
                                    },
                                    '& .MuiTiptap-RichTextField-menuBarContent': {
                                        backgroundColor: 'transparent !important',
                                    },
                                    '& .MuiButtonBase-root': {
                                        color: (theme.vars || theme).palette.text.primary,
                                    },
                                    '& .MuiSelect-select': {
                                        color: (theme.vars || theme).palette.text.primary,
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& svg': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& .MuiInputBase-root': {
                                        color: (theme.vars || theme).palette.text.primary,
                                    },
                                    '& .MuiMenuItem-root': {
                                        color: (theme.vars || theme).palette.text.primary,
                                        '& .MuiSvgIcon-root': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                        '& svg': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                    },
                                    '& .MuiMenu-paper': {
                                        backgroundColor: (theme.vars || theme).palette.background.paper,
                                        '& .MuiSvgIcon-root': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                        '& svg': {
                                            color: 'hsl(220, 30%, 6%) !important',
                                            ...theme.applyStyles('dark', {
                                                color: 'hsl(0, 0%, 100%) !important',
                                            }),
                                        },
                                    },
                                    '& .MuiList-root .MuiSvgIcon-root': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& .MuiList-root svg': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                    '& .MuiTiptap-MenuSelectTextAlign-icon': {
                                        color: 'hsl(220, 30%, 6%) !important',
                                        ...theme.applyStyles('dark', {
                                            color: 'hsl(0, 0%, 100%) !important',
                                        }),
                                    },
                                })}
                            >
                                    <MenuSelectFontFamily
                                        options={[
                                            { label: 'Inter', value: 'Inter, sans-serif' },
                                            { label: 'Arial', value: 'Arial, sans-serif' },
                                            { label: 'Georgia', value: 'Georgia, serif' },
                                        ]}
                                        emptyLabel="Fuente"
                                        unsetOptionLabel="Predeterminado"
                                        tooltipTitle="Fuente"
                                        slotProps={{
                                            select: {
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: (theme: Theme) => ({
                                                            backgroundColor: (theme.vars || theme).palette.background.paper,
                                                            '& .MuiMenuItem-root': {
                                                                color: (theme.vars || theme).palette.text.primary,
                                                            },
                                                        }),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    <MenuSelectHeading
                                        labels={{
                                            paragraph: 'Párrafo',
                                            heading1: 'Encabezado 1',
                                            heading2: 'Encabezado 2',
                                            heading3: 'Encabezado 3',
                                            heading4: 'Encabezado 4',
                                            heading5: 'Encabezado 5',
                                            heading6: 'Encabezado 6',
                                        }}
                                        tooltipTitle="Estilo de párrafo"
                                        slotProps={{
                                            select: {
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: (theme: Theme) => ({
                                                            backgroundColor: (theme.vars || theme).palette.background.paper,
                                                            '& .MuiMenuItem-root': {
                                                                color: (theme.vars || theme).palette.text.primary,
                                                            },
                                                        }),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    <MenuSelectTextAlign
                                        emptyLabel="Alinear"
                                        tooltipTitle="Alineación de texto"
                                        options={[
                                            { value: 'left', IconComponent: FormatAlignLeft, label: 'Alinear a la izquierda' },
                                            { value: 'center', IconComponent: FormatAlignCenter, label: 'Centrar' },
                                            { value: 'right', IconComponent: FormatAlignRight, label: 'Alinear a la derecha' },
                                            { value: 'justify', IconComponent: FormatAlignJustify, label: 'Justificar' },
                                        ]}
                                        sx={(theme) => ({
                                            '& .MuiSelect-select': {
                                                color: ((theme as Theme).vars || theme).palette.text.primary,
                                            },
                                            '& .MuiSvgIcon-root': {
                                                color: 'hsl(220, 30%, 6%) !important',
                                                ...(theme as Theme).applyStyles('dark', {
                                                    color: 'hsl(0, 0%, 100%) !important',
                                                }),
                                            },
                                            '& .MuiSelect-icon': {
                                                color: ((theme as Theme).vars || theme).palette.text.primary,
                                            },
                                            '& [class*="MenuSelectTextAlign-icon"]': {
                                                color: 'hsl(220, 30%, 6%) !important',
                                                ...(theme as Theme).applyStyles('dark', {
                                                    color: 'hsl(0, 0%, 100%) !important',
                                                }),
                                            },
                                        })}
                                        slotProps={{
                                            select: {
                                                MenuProps: {
                                                    PaperProps: {
                                                        sx: (theme: Theme) => ({
                                                            backgroundColor: (theme.vars || theme).palette.background.paper,
                                                            '& .MuiMenuItem-root': {
                                                                color: (theme.vars || theme).palette.text.primary,
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                color: 'hsl(220, 30%, 6%) !important',
                                                                ...(theme as Theme).applyStyles('dark', {
                                                                    color: 'hsl(0, 0%, 100%) !important',
                                                                }),
                                                            },
                                                            '& svg': {
                                                                color: 'hsl(220, 30%, 6%) !important',
                                                                ...theme.applyStyles('dark', {
                                                                    color: 'hsl(0, 0%, 100%) !important',
                                                                }),
                                                            },
                                                        }),
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    <MenuDivider />
                                    <MenuButtonBold tooltipLabel="Negrita" />
                                    <MenuButtonItalic tooltipLabel="Cursiva" />
                                    <MenuButtonUnderline tooltipLabel="Subrayado" />
                                    <MenuButtonStrikethrough tooltipLabel="Tachado" />
                                    <MenuDivider />
                                    <MenuButtonHighlightColor
                                        tooltipLabel="Color de resaltado"
                                        swatchColors={[
                                            { value: '#595959', label: 'Gris oscuro' },
                                            { value: '#dddddd', label: 'Gris claro' },
                                            { value: '#ffa6a6', label: 'Rojo claro' },
                                            { value: '#ffd699', label: 'Naranja claro' },
                                            { value: '#ffff00', label: 'Amarillo' },
                                            { value: '#99cc99', label: 'Verde claro' },
                                            { value: '#90c6ff', label: 'Azul claro' },
                                            { value: '#8085e9', label: 'Morado claro' },
                                        ]}
                                    />
                                    <MenuDivider />
                                    <MenuButtonOrderedList tooltipLabel="Lista numerada" />
                                    <MenuButtonBulletedList tooltipLabel="Lista con viñetas" />
                                    <MenuDivider />
                                    <MenuButtonRemoveFormatting tooltipLabel="Quitar formato" />
                                    <MenuDivider />
                                    <MenuButtonUndo tooltipLabel="Deshacer" />
                                    <MenuButtonRedo tooltipLabel="Rehacer" />
                                </MenuControlsContainer>
                        )} 
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancelar</Button>
                <Button onClick={handleSend} variant="contained" disabled={loading || selectedFolios.length === 0}>Enviar</Button>
            </DialogActions>
        </Dialog>
    );
}