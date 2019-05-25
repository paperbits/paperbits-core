export const presets: any = [
    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    md: {
                        rows: [
                            "auto",
                            "1fr"
                        ],
                        rowGap: "0",
                        cols: [
                            "1fr",
                            "1fr",
                            "1fr"
                        ],
                        colGap: "0"
                    },

                    xs: {
                        rows: [
                            "auto",
                            "auto",
                            "1fr"
                        ],
                        rowGap: "0",
                        cols: [
                            "1fr",
                            "1fr"
                        ],
                        colGap: "0"
                    }
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            md: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 2
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            md: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            md: {
                                position: {
                                    col: 3,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 3
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            md: {
                                position: {
                                    col: 2,
                                    row: 2
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto",
                        "1fr"
                    ],
                    rowGap: "0",
                    cols: [
                        "33.1fr",
                        "33.1fr",
                        "33.1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 2
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "1fr",
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 2
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "1fr",
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "33.1fr",
                        "33.1fr",
                        "33.1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 2
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto",
                        "1fr"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 3,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto",
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 3,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "1fr",
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "footer",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto",
                        "1fr"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto",
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto",
                        "1fr"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 3,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },


            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },

            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto",
                        "1fr"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "header",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 3,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 2
                                },
                                span: {
                                    cols: 2,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    md: {
                        rows: [
                            "auto",
                            "auto"
                        ],
                        rowGap: "0",
                        cols: [
                            "1fr",
                            "1fr"
                        ],
                        colGap: "0"
                    },
                    xs: {
                        rows: [
                            "auto",
                            "auto",
                            "auto",
                            "auto"
                        ],
                        rowGap: "0",
                        cols: [
                            "1fr"
                        ],
                        colGap: "0"
                    }
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            md: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            md: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            xs: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            md: {
                                position: {
                                    col: 1,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            xs: {
                                position: {
                                    col: 1,
                                    row: 4
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            md: {
                                position: {
                                    col: 2,
                                    row: 2
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            },
                            xs: {
                                position: {
                                    col: 1,
                                    row: 3
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "3fr",
                        "6fr",
                        "3fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },


    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "4fr",
                        "8fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "8fr",
                        "4fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "3fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "3fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "aside",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr",
                        "1fr",
                        "1fr",
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 2,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 3,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            },
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 4,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }

        ]
    },

    {
        type: "grid",
        styles: {
            instance: {
                grid: {
                    rows: [
                        "auto"
                    ],
                    rowGap: "0",
                    cols: [
                        "1fr"
                    ],
                    colGap: "0"
                }
            }
        },
        nodes: [
            {
                type: "grid-cell",
                role: "article",
                styles: {
                    instance: {
                        "grid-cell": {
                            xs: {
                                position: {
                                    col: 1,
                                    row: 1
                                },
                                span: {
                                    cols: 1,
                                    rows: 1
                                },
                                alignment: {
                                    vertical: "center",
                                    horizontal: "center"
                                }
                            }
                        }
                    }
                }
            }
        ]
    }
];