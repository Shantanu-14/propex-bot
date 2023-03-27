// const ProjectStatus = ["Pre Launch", "Under Construction", "Ready for Possession"];
// const saleType = ["New Launch", "Resale", "Rent Yelding Assets"];
// const roomType = ["1BHK", "2BHK", "3BHK", "4BHK", "1RK"];
// const propertyType = ["Apartment", "Villa", "Plot", "Commercial"]
// const CommercialType = ["Retail Space", "Office Space", "Industrial Space", "Warehouse"]

const saleType = [{
    id: "1",
    name: "New Launch",
    furtherFilter: {
        projectStatus: [{
            id: "1.1",
            name: "Pre Launch",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.3",
                    name: "Plot",
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }
                ]
            }
        }, {
            id: "1.2",
            name: "Under Construction",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }
                ]
            }
        }, {
            id: "1.3",
            name: "Ready for Possession",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.3",
                    name: "Plot",
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }
                ]
            }
        }
        ]

    }
}, {
    id: "2",
    name: "Resale",
    furtherFilter: {
        projectStatus: [{
            id: "2.1",
            name: "Under Renovation",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.3",
                    name: "Plot",
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }
                ]
            }
        }, {
            id: "2.2",
            name: "Ready for Possession",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.3",
                    name: "Plot",
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }
                ]
            }
        }
        ]
    }
}, {
    id: "1",
    name: "Rent Yielding Assets",
    furtherFilter: {
        projectStatus: [{
            id: "1.1",
            name: "Pre Launch",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.3",
                    name: "Plot",
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }
                ]
            }
        }, {
            id: "1.2",
            name: "Under Construction",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }
                ]
            }
        }, {
            id: "1.3",
            name: "Ready for Possession",
            furtherFilter: {
                propertyType: [{
                    id: "1.1.1",
                    name: "Apartment",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.1.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.1.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.1.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.1.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.1.5",
                            name: "1RK"
                        }
                        ]
                    }
                },
                {
                    id: "1.1.2",
                    name: "Villa",
                    furtherFilter: {
                        roomType: [{
                            id: "1.1.2.1",
                            name: "1BHK"
                        }, {
                            id: "1.1.2.2",
                            name: "2BHK"
                        }, {
                            id: "1.1.2.3",
                            name: "3BHK"
                        }
                            , {
                            id: "1.1.2.4",
                            name: "4BHK"
                        }
                            , {
                            id: "1.1.2.5",
                            name: "1RK"
                        }
                        ]
                    }
                }, {
                    id: "1.1.3",
                    name: "Plot",
                }, {
                    id: "1.1.4",
                    name: "Commercial",
                    furtherFilter: {
                        CommercialType: [{
                            id: "1.1.4.1",
                            name: "Retail Space"
                        }, {
                            id: "1.1.4.2",
                            name: "Office Space"
                        }, {
                            id: "1.1.4.3",
                            name: "Industrial Space"
                        }, {
                            id: "1.1.4.4",
                            name: "Warehouse"
                        }
                        ]
                    }
                }, {
                    id: "1.1.5",
                    name: "PG",
                    furtherFilter: {
                        ownerTypr: [{
                            id: "1.1.5.1",
                            name: "Fractional Ownership"
                        }, {
                            id: "1.1.5.2",
                            name: "Full Ownership"
                        }
                        ]
                    }
                }
                ]
            }
        }
        ]

    }
}];


module.exports = { saleType };