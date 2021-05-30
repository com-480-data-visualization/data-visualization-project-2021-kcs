// Wait for data to be imported from the server

// TODO: Add  $(document).ajaxStop( ) wrapper and remove example data
(function () {

    // Create of Map of songs

    //Sources:

    // https://bl.ocks.org/heybignick/3faf257bbbbc7743bb72310d03b86ee8
    //

    graph_data = [
        {
            "playlist_color": 1,
            "playlist_name": "R&B",
            "tracks": [
                {
                    "artists": [
                        {
                            "id": "1YfEcTuGvBQ8xSD1f53UnK",
                            "name": "Busta Rhymes"
                        },
                        {
                            "id": "4iHNK0tOyZPYnBU7nGAgpQ",
                            "name": "Mariah Carey"
                        },
                        {
                            "id": "7JXCJDLGh1k9cg6JbYCpYl",
                            "name": "Flipmode Squad"
                        }
                    ],
                    "id": "0YImOCkIJ2PWhCXaURCZnY",
                    "name": "I Know What You Want (feat. Flipmode Squad)"
                },
                {
                    "artists": [
                        {
                            "id": "21E3waRsmPlU7jZsS13rcj",
                            "name": "Ne-Yo"
                        }
                    ],
                    "id": "6CFPFnS9EcLs2I0nWqtWci",
                    "name": "Because Of You"
                },
                {
                    "artists": [
                        {
                            "id": "27FGXRNruFoOdf1vP8dqcH",
                            "name": "Cassie"
                        }
                    ],
                    "id": "4v5kAh2wWyCSuKuhMJK8u6",
                    "name": "Long Way 2 Go"
                },
                {
                    "artists": [
                        {
                            "id": "2JyWXPbkqI5ZJa3gwqVa0c",
                            "name": "Craig David"
                        }
                    ],
                    "id": "0gPQTLaqHDgdupKEok7J2x",
                    "name": "7 Days"
                },
                {
                    "artists": [
                        {
                            "id": "2gBjLmx6zQnFGQJCAQpRgw",
                            "name": "Nelly"
                        },
                        {
                            "id": "3AuMNF8rQAKOzjYppFNAoB",
                            "name": "Kelly Rowland"
                        }
                    ],
                    "id": "4nthV2eZAXnt4yiJMocLkG",
                    "name": "Dilemma"
                },
                {
                    "artists": [
                        {
                            "id": "6vWDO969PvNqNYHIOW5v0m",
                            "name": "Beyoncé"
                        },
                        {
                            "id": "3Isy6kedDrgPYoTS1dazA9",
                            "name": "Sean Paul"
                        }
                    ],
                    "id": "4WY3HyGXsWqjFRCVD6gnTe",
                    "name": "Baby Boy (feat. Sean Paul)"
                },
                {
                    "artists": [
                        {
                            "id": "1vfezMIyCr4XUdYRaKIKi3",
                            "name": "Keyshia Cole"
                        },
                        {
                            "id": "59wfkuBoNyhDMQGCljbUbA",
                            "name": "Diddy"
                        }
                    ],
                    "id": "24NPziq3dayIMKppeI94Um",
                    "name": "Last Night"
                },
                {
                    "artists": [
                        {
                            "id": "21E3waRsmPlU7jZsS13rcj",
                            "name": "Ne-Yo"
                        }
                    ],
                    "id": "6glklpxk7EtKIdxA3kYQS5",
                    "name": "Miss Independent"
                },
                {
                    "artists": [
                        {
                            "id": "1XkoF8ryArs86LZvFOkbyr",
                            "name": "Mary J. Blige"
                        }
                    ],
                    "id": "2YegxR5As7BeQuVp2U6pek",
                    "name": "Be Without You - Kendu Mix"
                },
                {
                    "artists": [
                        {
                            "id": "2DlGxzQSjYe5N6G9nkYghR",
                            "name": "Jennifer Lopez"
                        },
                        {
                            "id": "5pnbUBPifNnlusY8kTBivi",
                            "name": "Jadakiss"
                        },
                        {
                            "id": "2x8KDZdSONA3872CnhaAlX",
                            "name": "Styles P"
                        }
                    ],
                    "id": "4ZOyH6KjomjlqCz3oFqglr",
                    "name": "Jenny from the Block (feat. Jadakiss & Styles P.) - Track Masters Remix"
                },
                {
                    "artists": [
                        {
                            "id": "1Y8cdNmUJH7yBTd9yOvr5i",
                            "name": "Destiny's Child"
                        }
                    ],
                    "id": "7H6ev70Weq6DdpZyyTmUXk",
                    "name": "Say My Name"
                },
                {
                    "artists": [
                        {
                            "id": "20s0P9QLxGqKuCsGwFsp7w",
                            "name": "Mario"
                        }
                    ],
                    "id": "3ibKnFDaa3GhpPGlOUj7ff",
                    "name": "Let Me Love You"
                },
                {
                    "artists": [
                        {
                            "id": "23zg3TcAtWQy7J6upgbUnj",
                            "name": "Usher"
                        }
                    ],
                    "id": "2QsZVnbWVSjKMXK6K3uRBL",
                    "name": "U Remind Me"
                },
                {
                    "artists": [
                        {
                            "id": "4BIQA9vRkqXEnA2twmq7mU",
                            "name": "Mario Winans"
                        },
                        {
                            "id": "6uothxMWeLWIhsGeF7cyo4",
                            "name": "Enya"
                        },
                        {
                            "id": "59wfkuBoNyhDMQGCljbUbA",
                            "name": "Diddy"
                        }
                    ],
                    "id": "2yr2HnFYl7XvqJk4fXoQBt",
                    "name": "I Don't Wanna Know (feat. Enya & P. Diddy) - 2016 Remaster"
                },
                {
                    "artists": [
                        {
                            "id": "0OUXTnqjvTg4iZ7Lhq6vv7",
                            "name": "Lucy Pearl"
                        }
                    ],
                    "id": "2J2hVpwVV25EK8Bvd3OgCK",
                    "name": "Don't Mess With My Man"
                },
                {
                    "artists": [
                        {
                            "id": "3ScY9CQxNLQei8Umvpx5g6",
                            "name": "Fat Joe"
                        },
                        {
                            "id": "1J2VVASYAamtQ3Bt8wGgA6",
                            "name": "Ja Rule"
                        },
                        {
                            "id": "5rkVyNGXEgeUqKkB5ccK83",
                            "name": "Ashanti"
                        }
                    ],
                    "id": "2mKouqwAIdQnMP43zxR89r",
                    "name": "What's Luv? (feat. Ja-Rule & Ashanti)"
                },
                {
                    "artists": [
                        {
                            "id": "05oH07COxkXKIMt6mIPRee",
                            "name": "Brandy"
                        },
                        {
                            "id": "6nzxy2wXs6tLgzEtqOkEi2",
                            "name": "Monica"
                        }
                    ],
                    "id": "6sHsXIJoEN5JpdkGMQDJxt",
                    "name": "The Boy Is Mine"
                },
                {
                    "artists": [
                        {
                            "id": "23zg3TcAtWQy7J6upgbUnj",
                            "name": "Usher"
                        },
                        {
                            "id": "3DiDSECUqqY1AuBP8qtaIa",
                            "name": "Alicia Keys"
                        }
                    ],
                    "id": "68vgtRHr7iZHpzGpon6Jlo",
                    "name": "My Boo"
                },
                {
                    "artists": [
                        {
                            "id": "0z4gvV4rjIZ9wHck67ucSV",
                            "name": "Akon"
                        },
                        {
                            "id": "7hJcb9fa4alzcOq3EaNPoG",
                            "name": "Snoop Dogg"
                        }
                    ],
                    "id": "6NncjnSD7JLEetWb9KqMRY",
                    "name": "I Wanna Love You"
                },
                {
                    "artists": [
                        {
                            "id": "5KNqYrivNgVCHBssEUSu5B",
                            "name": "Donell Jones"
                        },
                        {
                            "id": "64ccradw8gAQn9gMQZmEha",
                            "name": "Lisa \"Left Eye\" Lopes"
                        }
                    ],
                    "id": "5PMKzsUsTpZZGsCcJBuhP2",
                    "name": "U Know What's Up (feat. Lisa \"Left Eye\" Lopes)"
                },
                {
                    "artists": [
                        {
                            "id": "0urTpYCsixqZwgNTkPJOJ4",
                            "name": "Aaliyah"
                        }
                    ],
                    "id": "1XRP3YAk85HKboqEkCMXla",
                    "name": "Try Again"
                },
                {
                    "artists": [
                        {
                            "id": "5NDMothbpdpq2xHqSjrrWn",
                            "name": "Faith Evans"
                        }
                    ],
                    "id": "7MQywXGHEev7JmwwIzMcao",
                    "name": "Love Like This"
                },
                {
                    "artists": [
                        {
                            "id": "1J2VVASYAamtQ3Bt8wGgA6",
                            "name": "Ja Rule"
                        },
                        {
                            "id": "5rkVyNGXEgeUqKkB5ccK83",
                            "name": "Ashanti"
                        }
                    ],
                    "id": "3J4YoloryJCieZ9kapS1oL",
                    "name": "Always On Time"
                },
                {
                    "artists": [
                        {
                            "id": "4iHNK0tOyZPYnBU7nGAgpQ",
                            "name": "Mariah Carey"
                        }
                    ],
                    "id": "4EI8VuxUuIHKfafU72emqz",
                    "name": "We Belong Together"
                },
                {
                    "artists": [
                        {
                            "id": "0HCeK90YUyjWi0utTPYXw1",
                            "name": "Truth Hurts"
                        },
                        {
                            "id": "3PyWEKLWI0vHPmoNrIX0QE",
                            "name": "Rakim"
                        }
                    ],
                    "id": "36jSIOSE72neBbKntCthqw",
                    "name": "Addictive"
                },
                {
                    "artists": [
                        {
                            "id": "21E3waRsmPlU7jZsS13rcj",
                            "name": "Ne-Yo"
                        }
                    ],
                    "id": "4SRqDmPxYX0pUb5B5ut2Ri",
                    "name": "So Sick"
                },
                {
                    "artists": [
                        {
                            "id": "59wfkuBoNyhDMQGCljbUbA",
                            "name": "Diddy"
                        },
                        {
                            "id": "23zg3TcAtWQy7J6upgbUnj",
                            "name": "Usher"
                        },
                        {
                            "id": "2gie1bU1LwnxdFAJoTLjzT",
                            "name": "Loon"
                        }
                    ],
                    "id": "7lVNTXkI3cHFvcXiI8damb",
                    "name": "I Need a Girl (Pt. 1) [feat. Usher & Loon]"
                },
                {
                    "artists": [
                        {
                            "id": "3DiDSECUqqY1AuBP8qtaIa",
                            "name": "Alicia Keys"
                        }
                    ],
                    "id": "6IwKcFdiRQZOWeYNhUiWIv",
                    "name": "No One"
                },
                {
                    "artists": [
                        {
                            "id": "05oH07COxkXKIMt6mIPRee",
                            "name": "Brandy"
                        },
                        {
                            "id": "6gbGGM0E8Q1hE511psqxL0",
                            "name": "Ray J"
                        }
                    ],
                    "id": "7rBzAkopTL4baeJGCFU7M4",
                    "name": "Another Day in Paradise - R&B-Version"
                },
                {
                    "artists": [
                        {
                            "id": "6wPhSqRtPu1UhRCDX5yaDJ",
                            "name": "The Pussycat Dolls"
                        },
                        {
                            "id": "1YfEcTuGvBQ8xSD1f53UnK",
                            "name": "Busta Rhymes"
                        }
                    ],
                    "id": "24kGngQeXHt0uhffKpq0zj",
                    "name": "Don't Cha"
                },
                {
                    "artists": [
                        {
                            "id": "5pKCCKE2ajJHZ9KAiaK11H",
                            "name": "Rihanna"
                        },
                        {
                            "id": "21E3waRsmPlU7jZsS13rcj",
                            "name": "Ne-Yo"
                        }
                    ],
                    "id": "4789yoeBIsBi6et3z0fyly",
                    "name": "Hate That I Love You"
                },
                {
                    "artists": [
                        {
                            "id": "5rkVyNGXEgeUqKkB5ccK83",
                            "name": "Ashanti"
                        }
                    ],
                    "id": "6zMUIb4uce1CzpbjR3vMdN",
                    "name": "Foolish"
                },
                {
                    "artists": [
                        {
                            "id": "6vWDO969PvNqNYHIOW5v0m",
                            "name": "Beyoncé"
                        }
                    ],
                    "id": "2CvOqDpQIMw69cCzWqr5yr",
                    "name": "Halo"
                },
                {
                    "artists": [
                        {
                            "id": "31TPClRtHm23RisEBtV3X7",
                            "name": "Justin Timberlake"
                        }
                    ],
                    "id": "6LtidZ09rh1n991F8qYPui",
                    "name": "What Goes Around...Comes Around - Radio Edit"
                },
                {
                    "artists": [
                        {
                            "id": "4HgF4KnohByNElYid7iCNb",
                            "name": "Bobby V."
                        }
                    ],
                    "id": "4Ilen0VxPEsVRLpnePji8P",
                    "name": "Slow Down - 12\" Version"
                },
                {
                    "artists": [
                        {
                            "id": "4eAOcbAXIF4BmbN6E1QIlw",
                            "name": "Christina Milian"
                        }
                    ],
                    "id": "0IspqeDVLIw46spUMhOKRL",
                    "name": "When You Look At Me - Radio Edit"
                },
                {
                    "artists": [
                        {
                            "id": "3DiDSECUqqY1AuBP8qtaIa",
                            "name": "Alicia Keys"
                        }
                    ],
                    "id": "3XVBdLihbNbxUwZosxcGuJ",
                    "name": "If I Ain't Got You"
                },
                {
                    "artists": [
                        {
                            "id": "3nFkdlSjzX9mRTtwJOzDYB",
                            "name": "JAY-Z"
                        },
                        {
                            "id": "6vWDO969PvNqNYHIOW5v0m",
                            "name": "Beyoncé"
                        }
                    ],
                    "id": "5ljCWsDlSyJ41kwqym2ORw",
                    "name": "03' Bonnie & Clyde"
                },
                {
                    "artists": [
                        {
                            "id": "31TPClRtHm23RisEBtV3X7",
                            "name": "Justin Timberlake"
                        },
                        {
                            "id": "4OBJLual30L7gRl5UkeRcT",
                            "name": "T.I."
                        }
                    ],
                    "id": "0gs72Zn1Nxin1kvKpo9ee5",
                    "name": "My Love"
                },
                {
                    "artists": [
                        {
                            "id": "0TImkz4nPqjegtVSMZnMRq",
                            "name": "TLC"
                        }
                    ],
                    "id": "1KGi9sZVMeszgZOWivFpxs",
                    "name": "No Scrubs"
                },
                {
                    "artists": [
                        {
                            "id": "5pKCCKE2ajJHZ9KAiaK11H",
                            "name": "Rihanna"
                        }
                    ],
                    "id": "3goSVuTt3fDYDP6kRnFwuL",
                    "name": "Take A Bow"
                },
                {
                    "artists": [
                        {
                            "id": "6vytZ677lz4LzCrUDcDokM",
                            "name": "Blu Cantrell"
                        },
                        {
                            "id": "3Isy6kedDrgPYoTS1dazA9",
                            "name": "Sean Paul"
                        }
                    ],
                    "id": "1BPybPVkDfUjFDvqG04l58",
                    "name": "Breathe (feat. Sean Paul) - Rap Version"
                },
                {
                    "artists": [
                        {
                            "id": "6vWDO969PvNqNYHIOW5v0m",
                            "name": "Beyoncé"
                        }
                    ],
                    "id": "6XsT5UGfpaFeHQf5LRIy4W",
                    "name": "Me, Myself and I"
                },
                {
                    "artists": [
                        {
                            "id": "3DiDSECUqqY1AuBP8qtaIa",
                            "name": "Alicia Keys"
                        }
                    ],
                    "id": "3unsLiH5FXmaDWtT5Imolu",
                    "name": "Fallin'"
                },
                {
                    "artists": [
                        {
                            "id": "7aBzpmFXB4WWpPl2F7RjBe",
                            "name": "Wyclef Jean"
                        },
                        {
                            "id": "1XkoF8ryArs86LZvFOkbyr",
                            "name": "Mary J. Blige"
                        }
                    ],
                    "id": "1Ov4E4nE7E0yzeqpbhEE5g",
                    "name": "911 (feat. Mary J. Blige)"
                },
                {
                    "artists": [
                        {
                            "id": "0iVrCROxeyon7MZUW3MfzT",
                            "name": "Montell Jordan"
                        }
                    ],
                    "id": "3ii5VBrIXJXKEVkjx1IAdP",
                    "name": "Get It On Tonite"
                },
                {
                    "artists": [
                        {
                            "id": "4iHNK0tOyZPYnBU7nGAgpQ",
                            "name": "Mariah Carey"
                        },
                        {
                            "id": "50NoVNy9GU1lCrDV8iGpyu",
                            "name": "ODB"
                        }
                    ],
                    "id": "0iqGkQyaeryW2lVkwLgrVa",
                    "name": "Fantasy - Feat. O.D.B."
                },
                {
                    "artists": [
                        {
                            "id": "7bXgB6jMjp9ATFy66eO08Z",
                            "name": "Chris Brown"
                        }
                    ],
                    "id": "7ByfFjT83MNmisdzhZ50Fv",
                    "name": "With You"
                },
                {
                    "artists": [
                        {
                            "id": "2DlGxzQSjYe5N6G9nkYghR",
                            "name": "Jennifer Lopez"
                        },
                        {
                            "id": "1J2VVASYAamtQ3Bt8wGgA6",
                            "name": "Ja Rule"
                        }
                    ],
                    "id": "7rOIWUhSfjWh4E7443PYE8",
                    "name": "I'm Real - Murder Remix"
                },
                {
                    "artists": [
                        {
                            "id": "6XpaIBNiVzIetEPCWDvAFP",
                            "name": "Whitney Houston"
                        }
                    ],
                    "id": "1ckU1EhAO0Nr73QYw24SWJ",
                    "name": "My Love Is Your Love"
                },
                {
                    "artists": [
                        {
                            "id": "0le01dl1WllSHhjEXRl4in",
                            "name": "Tamia"
                        }
                    ],
                    "id": "3c6afiysmB7OnxQzzSqRfD",
                    "name": "So Into You"
                },
                {
                    "artists": [
                        {
                            "id": "1XkoF8ryArs86LZvFOkbyr",
                            "name": "Mary J. Blige"
                        }
                    ],
                    "id": "3aw9iWUQ3VrPQltgwvN9Xu",
                    "name": "Family Affair"
                },
                {
                    "artists": [
                        {
                            "id": "6vWDO969PvNqNYHIOW5v0m",
                            "name": "Beyoncé"
                        }
                    ],
                    "id": "6RX5iL93VZ5fKmyvNXvF1r",
                    "name": "Irreplaceable"
                },
                {
                    "artists": [
                        {
                            "id": "3DiDSECUqqY1AuBP8qtaIa",
                            "name": "Alicia Keys"
                        }
                    ],
                    "id": "4esOae7i4rqTbAu9o5Pxco",
                    "name": "Girl on Fire"
                },
                {
                    "artists": [
                        {
                            "id": "360IAlyVv4PCEVjgyMZrxK",
                            "name": "Miguel"
                        }
                    ],
                    "id": "5hJFhO9dvhJoDvUZZ9iWSw",
                    "name": "Adorn"
                },
                {
                    "artists": [
                        {
                            "id": "12Kgt2eahvxNWhD5PnSUde",
                            "name": "Mary Mary"
                        }
                    ],
                    "id": "7JKEA8xYDoFp4q0QBW2PGg",
                    "name": "Shackles (Praise You)"
                },
                {
                    "artists": [
                        {
                            "id": "31TPClRtHm23RisEBtV3X7",
                            "name": "Justin Timberlake"
                        }
                    ],
                    "id": "7Lf7oSEVdzZqTA0kEDSlS5",
                    "name": "Cry Me a River"
                },
                {
                    "artists": [
                        {
                            "id": "7bXgB6jMjp9ATFy66eO08Z",
                            "name": "Chris Brown"
                        }
                    ],
                    "id": "7DFnq8FYhHMCylykf6ZCxA",
                    "name": "Yo (Excuse Me Miss)"
                },
                {
                    "artists": [
                        {
                            "id": "63wjoROpeh5f11Qm93UiJ1",
                            "name": "Keri Hilson"
                        },
                        {
                            "id": "5K4W6rqBFWDnAN6FQUkS6x",
                            "name": "Kanye West"
                        },
                        {
                            "id": "21E3waRsmPlU7jZsS13rcj",
                            "name": "Ne-Yo"
                        }
                    ],
                    "id": "0JmGVy7IzUM27My3UuEOOZ",
                    "name": "Knock You Down"
                },
                {
                    "artists": [
                        {
                            "id": "1Y8cdNmUJH7yBTd9yOvr5i",
                            "name": "Destiny's Child"
                        }
                    ],
                    "id": "2n4uOdMHzEvcZ0KP7iQnay",
                    "name": "Lose My Breath"
                }
            ]
        },
        {
            "playlist_color": 2,
            "playlist_name": "Afro Music",
            "tracks": [
                {
                    "artists": [
                        {
                            "id": "3wcj11K77LjEY1PkEazffa",
                            "name": "Burna Boy"
                        }
                    ],
                    "id": "15NVnnLI5oXQSw10lKrR51",
                    "name": "Kilometre"
                },
                {
                    "artists": [
                        {
                            "id": "4fDx6CTJ4KWhnAg6TvwmWe",
                            "name": "Serge Ibaka"
                        },
                        {
                            "id": "7gU9VyFRN3JWPJ5oHOil60",
                            "name": "Tayc"
                        }
                    ],
                    "id": "2XqVB8cl1i4dg3KS5mkcYB",
                    "name": "LEGGO"
                },
                {
                    "artists": [
                        {
                            "id": "4TAoP0f9OuWZUesao43xUW",
                            "name": "Mr Eazi"
                        },
                        {
                            "id": "7xsrttFCLfrav97RsNjSPK",
                            "name": "Dre Skull"
                        },
                        {
                            "id": "62DmErcU7dqZbJaDqwsqzR",
                            "name": "Popcaan"
                        }
                    ],
                    "id": "6MNFebzmVKDYvgjxSQcAfq",
                    "name": "Sekkle & Bop"
                },
                {
                    "artists": [
                        {
                            "id": "1PyToLP6F2rzV0ZSR71lgl",
                            "name": "Bryan Mg"
                        }
                    ],
                    "id": "3a9VWWcadXinOPMQzJS8uU",
                    "name": "MYKILLI"
                },
                {
                    "artists": [
                        {
                            "id": "7IlRNXHjoOCgEAWN5qYksg",
                            "name": "Aya Nakamura"
                        }
                    ],
                    "id": "6wL9pSXJ4roDSEoBpYyQy7",
                    "name": "Bobo"
                },
                {
                    "artists": [
                        {
                            "id": "1XavfPKBpNjkOfxHINlMHF",
                            "name": "Joeboy"
                        },
                        {
                            "id": "52iM1kP5BpnLypZ0VtrpyY",
                            "name": "Kwesi Arthur"
                        }
                    ],
                    "id": "4ahI2IdM0Z1e7dLopcNJQi",
                    "name": "Door"
                },
                {
                    "artists": [
                        {
                            "id": "4uJNQGa3L2frXDxwgouTIw",
                            "name": "Franglish"
                        }
                    ],
                    "id": "0z4fjeh0gGFCHdmsvy3JJk",
                    "name": "Baby Mama"
                },
                {
                    "artists": [
                        {
                            "id": "4on7a4BKixLl1rSlEcaY8Y",
                            "name": "Blaq Jerzee"
                        },
                        {
                            "id": "4TAoP0f9OuWZUesao43xUW",
                            "name": "Mr Eazi"
                        },
                        {
                            "id": "1eCaedusgydlcn69blHOvL",
                            "name": "Harmonize"
                        }
                    ],
                    "id": "4C0dBjF3xoqF3wGWO2r9k9",
                    "name": "Falling For U"
                },
                {
                    "artists": [
                        {
                            "id": "64XqdWjtYhfMJeQB7wtAwS",
                            "name": "Hiro"
                        },
                        {
                            "id": "1q7T9rFQ2a2ukA1PU51fo3",
                            "name": "Koba LaD"
                        }
                    ],
                    "id": "4on8pxur6Uz6RCOvTeWXoX",
                    "name": "Quatre secondes"
                },
                {
                    "artists": [
                        {
                            "id": "6IhG3Yxm3UW98jhyBvrIut",
                            "name": "Tekno"
                        },
                        {
                            "id": "04Hrgux8cIaNJKUAX7WwJN",
                            "name": "Mafikizolo"
                        }
                    ],
                    "id": "2BCzqnZHvL898uoLXwCdGp",
                    "name": "Enjoy (Remix) [feat. Mafikizolo]"
                },
                {
                    "artists": [
                        {
                            "id": "7gU9VyFRN3JWPJ5oHOil60",
                            "name": "Tayc"
                        }
                    ],
                    "id": "360oH1CqXe9XXzbbi6hvyr",
                    "name": "Le temps"
                },
                {
                    "artists": [
                        {
                            "id": "2TwUVWFJs4LD0lOBbJXnNa",
                            "name": "Korede Bello"
                        }
                    ],
                    "id": "43WvXWJ9RLYYwWvrIZ4Z96",
                    "name": "Fine FIne"
                },
                {
                    "artists": [
                        {
                            "id": "26zgIfFyTCImkHAp5gwKW8",
                            "name": "Joé Dwèt Filé"
                        },
                        {
                            "id": "4krMq8pXkLVTGplpYgHlnV",
                            "name": "Ronisia"
                        }
                    ],
                    "id": "2uj7OACDZUQIvAfKAwtHES",
                    "name": "Jolie madame (feat. Ronisia)"
                },
                {
                    "artists": [
                        {
                            "id": "5ywjxFhmhHGQBsK3DundNf",
                            "name": "Peruzzi"
                        },
                        {
                            "id": "75VKfyoBlkmrJFDqo1o2VY",
                            "name": "Fireboy DML"
                        }
                    ],
                    "id": "5fNuSX2WFLQgJ4X5b5qexN",
                    "name": "Southy Love"
                },
                {
                    "artists": [
                        {
                            "id": "26XzvosH2cl8Re6KSo9m8Z",
                            "name": "ZieZie"
                        },
                        {
                            "id": "45oFvHE9QZYC1vn5pVCDlu",
                            "name": "Ya Levis"
                        }
                    ],
                    "id": "4POObmgexNr9jqBLMeuhYN",
                    "name": "Show Me (Montre Moi)"
                },
                {
                    "artists": [
                        {
                            "id": "1ixqGowpDM21RwyJmJ7hpv",
                            "name": "Skales"
                        },
                        {
                            "id": "0Y3agQaa6g2r0YmHPOO9rh",
                            "name": "DaVido"
                        }
                    ],
                    "id": "2cJesgQwggcf3ciGuD6Z1I",
                    "name": "This Your Body"
                },
                {
                    "artists": [
                        {
                            "id": "63hFhXYW3r2q8uW2Rf3LUw",
                            "name": "H Magnum"
                        }
                    ],
                    "id": "7JYFFUQIkrBS5CTg56grIx",
                    "name": "Ecol’O.G"
                },
                {
                    "artists": [
                        {
                            "id": "5yOvAmpIR7hVxiS6Ls5DPO",
                            "name": "Omah Lay"
                        }
                    ],
                    "id": "6NgjdJrK7Bpyvsm8yDtx4H",
                    "name": "Godly"
                },
                {
                    "artists": [
                        {
                            "id": "22I8wvU1Zw6EMiOt4W98BN",
                            "name": "Arma Jackson"
                        },
                        {
                            "id": "7gU9VyFRN3JWPJ5oHOil60",
                            "name": "Tayc"
                        }
                    ],
                    "id": "2s4WVoca0jOT8DszCOdA0n",
                    "name": "Distance (feat. Tayc)"
                },
                {
                    "artists": [
                        {
                            "id": "3L5xJkOr7jAd1ji5Hrdl8a",
                            "name": "Jujuboy Star"
                        }
                    ],
                    "id": "0C1wC8uhOzENMF59dxYmnK",
                    "name": "Enjoyment"
                },
                {
                    "artists": [
                        {
                            "id": "0dSAqgiskNQy5Kr6aRDiZj",
                            "name": "Sifoor"
                        }
                    ],
                    "id": "03Qo7qJxgC31kxHh8ASkJl",
                    "name": "Bogota"
                },
                {
                    "artists": [
                        {
                            "id": "6zK1M4TcabpLQMNmmG2P0Q",
                            "name": "chike"
                        },
                        {
                            "id": "4Ns55iOSe1Im2WU2e1Eym0",
                            "name": "Simi"
                        }
                    ],
                    "id": "2KfKuJ3iWLYu8M1srzG2h0",
                    "name": "Running (To You)"
                },
                {
                    "artists": [
                        {
                            "id": "7xNYY1Zkb1vks5m9ATlJok",
                            "name": "Naza"
                        },
                        {
                            "id": "7x3eTVPlBiPjXHn3qotY86",
                            "name": "KeBlack"
                        },
                        {
                            "id": "6W5uA6CNMf3hd2j4a2XWCx",
                            "name": "Naps"
                        }
                    ],
                    "id": "3ijQFCjoldvRJjOn4AK4iS",
                    "name": "Ma Play"
                },
                {
                    "artists": [
                        {
                            "id": "280KWyWqhLfQHShStxIFdh",
                            "name": "Crissfizzy"
                        }
                    ],
                    "id": "0hknIqXxJypBolqSy9jNOC",
                    "name": "Oshey"
                },
                {
                    "artists": [
                        {
                            "id": "4fDx6CTJ4KWhnAg6TvwmWe",
                            "name": "Serge Ibaka"
                        },
                        {
                            "id": "6Te49r3A6f5BiIgBRxH7FH",
                            "name": "Ninho"
                        }
                    ],
                    "id": "7moGDROshDKDpuQxtQ3q4m",
                    "name": "Champion"
                },
                {
                    "artists": [
                        {
                            "id": "6LzSS8yBk2YQpAvQxzOu0M",
                            "name": "Zuchu"
                        }
                    ],
                    "id": "0b6rUnRfjDuv60k5oWrCKa",
                    "name": "Sukari"
                },
                {
                    "artists": [
                        {
                            "id": "2TwUVWFJs4LD0lOBbJXnNa",
                            "name": "Korede Bello"
                        }
                    ],
                    "id": "765zfCJsXtDDPInx1smYLo",
                    "name": "Real Man"
                },
                {
                    "artists": [
                        {
                            "id": "45oFvHE9QZYC1vn5pVCDlu",
                            "name": "Ya Levis"
                        },
                        {
                            "id": "4uJNQGa3L2frXDxwgouTIw",
                            "name": "Franglish"
                        }
                    ],
                    "id": "1QYZ2FUoqOmN30d6pOLt0x",
                    "name": "Pour moi"
                },
                {
                    "artists": [
                        {
                            "id": "7cUFvbLZrLySXBoxk39kCZ",
                            "name": "Locko"
                        }
                    ],
                    "id": "5yRcbTxVZ0FRPnHq6p9Xqo",
                    "name": "Magnet"
                },
                {
                    "artists": [
                        {
                            "id": "14PimM6ohO2gYftuwTam9V",
                            "name": "KiDi"
                        }
                    ],
                    "id": "3h3xeg5OGNYVM0U9rOAc6j",
                    "name": "Touch It"
                },
                {
                    "artists": [
                        {
                            "id": "7fKO99ryLDo8VocdtVvwZW",
                            "name": "Yemi Alade"
                        },
                        {
                            "id": "583D4MicNImtI9URI0fIFT",
                            "name": "Rudeboy"
                        }
                    ],
                    "id": "7mXL5FUehGFn9hi84ePMeH",
                    "name": "Deceive"
                },
                {
                    "artists": [
                        {
                            "id": "1f1DjtYgH6yBzBSiGteBJl",
                            "name": "Were-vana"
                        }
                    ],
                    "id": "3y2SEDE8XKVOgA4XofZ95A",
                    "name": "Bombardé"
                },
                {
                    "artists": [
                        {
                            "id": "1zO1FWFxxNUCqUuGATxZQZ",
                            "name": "Gyakie"
                        },
                        {
                            "id": "5yOvAmpIR7hVxiS6Ls5DPO",
                            "name": "Omah Lay"
                        }
                    ],
                    "id": "4vLY6fJQWgBzQYHzguDZme",
                    "name": "Forever (Remix)"
                },
                {
                    "artists": [
                        {
                            "id": "4YLUMAgNyttwx4hUHgtBtR",
                            "name": "Blue Lab Beats"
                        },
                        {
                            "id": "5gztxlbwQ2Gamz2hWaNIrA",
                            "name": "Ghetto Boy"
                        }
                    ],
                    "id": "7CF5szRZnLWnjcUlkdcxJP",
                    "name": "Blow You Away (Delilah)"
                },
                {
                    "artists": [
                        {
                            "id": "7mlT0u4rarQ2SkRMEWme8L",
                            "name": "Nesly"
                        },
                        {
                            "id": "4eYnorQRhVHT2KBl2UyHHd",
                            "name": "Vegedream"
                        }
                    ],
                    "id": "3wYQCyG2SavDChkWEgW3Yd",
                    "name": "B.E.T.E"
                },
                {
                    "artists": [
                        {
                            "id": "0WgwOS7j1CB5tIRa4QM50K",
                            "name": "Seyi Shay"
                        },
                        {
                            "id": "7fKO99ryLDo8VocdtVvwZW",
                            "name": "Yemi Alade"
                        }
                    ],
                    "id": "0NWyE9gJ8Q2fOdJfGcJwG3",
                    "name": "Pempe"
                },
                {
                    "artists": [
                        {
                            "id": "0GGKrcPOlBkmBzQDf2Ogkl",
                            "name": "Kuami Eugene"
                        }
                    ],
                    "id": "6ftfTiJhWNZskedEv5ZYM0",
                    "name": "Dollar On You"
                },
                {
                    "artists": [
                        {
                            "id": "5M0cj31cGkk0sbevwtSG52",
                            "name": "Rachelle Allison"
                        },
                        {
                            "id": "1AT8NKdQOU0EVPu6ehN4NA",
                            "name": "Meryl"
                        }
                    ],
                    "id": "5qzROJLIiEgH38ZzrF5Mes",
                    "name": "Ma Petite"
                },
                {
                    "artists": [
                        {
                            "id": "4ovtyvs7j1jSmwhkBGHqSr",
                            "name": "Olamide"
                        },
                        {
                            "id": "5yOvAmpIR7hVxiS6Ls5DPO",
                            "name": "Omah Lay"
                        }
                    ],
                    "id": "5DS9LiyEdw2zY8bM6kjjgM",
                    "name": "Infinity (feat. Omah Lay)"
                },
                {
                    "artists": [
                        {
                            "id": "63hFhXYW3r2q8uW2Rf3LUw",
                            "name": "H Magnum"
                        }
                    ],
                    "id": "4iDbqfI4KiFIVaysC097vW",
                    "name": "Te Quiero"
                },
                {
                    "artists": [
                        {
                            "id": "6m1LYS5NQonxjOcQFPQOb5",
                            "name": "Frenna"
                        },
                        {
                            "id": "7fKO99ryLDo8VocdtVvwZW",
                            "name": "Yemi Alade"
                        }
                    ],
                    "id": "53MCnnU5XI7Xr1IbaF6KN8",
                    "name": "Handle It"
                },
                {
                    "artists": [
                        {
                            "id": "4DWVHNUG04lB1nYDbQmjLm",
                            "name": "J. Martins"
                        }
                    ],
                    "id": "3MY898fO8bqIh61Dk2Or6S",
                    "name": "Sote"
                },
                {
                    "artists": [
                        {
                            "id": "0016RK4nfua0DSs6FQwVRV",
                            "name": "ZwartWerk"
                        },
                        {
                            "id": "6hXVcZyUR2WLIXDkXrw1eQ",
                            "name": "ND"
                        }
                    ],
                    "id": "41KmLEA5WDnjfQyuvQB3R9",
                    "name": "Vibes"
                },
                {
                    "artists": [
                        {
                            "id": "5ywjxFhmhHGQBsK3DundNf",
                            "name": "Peruzzi"
                        },
                        {
                            "id": "4aDTgdQaxgRIrjEZJYjsAp",
                            "name": "DaVido"
                        }
                    ],
                    "id": "4NDnOHcGGbUh3MCs7cxlW0",
                    "name": "Somebody Baby"
                },
                {
                    "artists": [
                        {
                            "id": "1YzBVaJOz8SAPDPcA13odz",
                            "name": "Robinio Mundibu"
                        }
                    ],
                    "id": "6HaG2xeQhbuXfVTuUUwj2x",
                    "name": "Bis"
                },
                {
                    "artists": [
                        {
                            "id": "3ukrG1BmfEiuo0KDj8YTTS",
                            "name": "Teni"
                        }
                    ],
                    "id": "3n8cVzL2mibNoBC6aR5lo0",
                    "name": "MOSLADO"
                },
                {
                    "artists": [
                        {
                            "id": "5twTCOm58CXYCqCny4gYcQ",
                            "name": "Ric Hassani"
                        },
                        {
                            "id": "1SupJlEpv7RS2tPNRaHViT",
                            "name": "Nicky Jam"
                        }
                    ],
                    "id": "0hRyt5qiE2pwTSAeeUS7lW",
                    "name": "Angel"
                },
                {
                    "artists": [
                        {
                            "id": "3NbqBIc16CNAe5nYSmHR3p",
                            "name": "JAE5"
                        },
                        {
                            "id": "2p1fiYHYiXz9qi0JJyxBzN",
                            "name": "Skepta"
                        },
                        {
                            "id": "46pWGuE3dSwY3bMMXGBvVS",
                            "name": "Rema"
                        }
                    ],
                    "id": "2Jy4EdqIZswDZvVDh5dx3A",
                    "name": "Dimension (feat. Skepta & Rema)"
                },
                {
                    "artists": [
                        {
                            "id": "4ovtyvs7j1jSmwhkBGHqSr",
                            "name": "Olamide"
                        }
                    ],
                    "id": "5mcD4M6ERcFxeB2T6oe4dZ",
                    "name": "Rock"
                },
                {
                    "artists": [
                        {
                            "id": "51qUDJb5AtQX6jIL4VJx6M",
                            "name": "Angelique Kidjo"
                        },
                        {
                            "id": "4TAoP0f9OuWZUesao43xUW",
                            "name": "Mr Eazi"
                        },
                        {
                            "id": "0VVnWF3KNaa5O7ESohKhAx",
                            "name": "Salif Keita"
                        }
                    ],
                    "id": "0DE87s5So0aKNtcSWfgvi5",
                    "name": "Africa, One Of A Kind"
                }
            ]
        }
    ];


    function build_songs_map() {
        let songs = new Map();
        let pos = 0;

        for (let playlist of graph_data) {
            for (let track of playlist.tracks) {
                let track_data = track;
                track_data.playlist_name = playlist.playlist_name;
                track_data.playlist_color = playlist.playlist_color;
                songs.set(track.id, track_data);
            }
        }

        return songs
    }

    function get_all_tracks() {
        let tracks = [];
        for (let playlist of graph_data) {
            for (let track of playlist.tracks) {
                tracks.push(track.id)
            }
        }
        return tracks
    }

    function get_related_artists(artist_id) {
        $.ajax({
            url: `https://api.spotify.com/v1/artists/${artist_id}/related-artists`,
            headers: headers,
            success: function (response) {
                return response.artists.map(a => clean_artist_data(a))
            }
        })
    }

    function compute_coordinates(pos, total) {
        const rad = (pos / total) * 2 * Math.PI;
        return {x: Math.cos(rad) * 4 * total, y: Math.sin(rad) * 4 * total}
    }

    let songs_map = build_songs_map();
    let all_tracks_id = get_all_tracks();

    let width, height;
    let chartWidth, chartHeight;
    let margin;
    const svg = d3.select("#graph-artists").append("svg");
    const chartLayer = svg.append("g").classed("chartLayer", true);

    let color = d3.scaleOrdinal()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .range(["#FF0000", "#80FF00", "#00C9FF", "#FFFB00", "#FF00F7", "#FFC500", "#00FFA2", "#8F00FF", "#0013FF"]);

    main();

    function build_nodes() {

        let current_i = 0;
        let nodes = [];
        for (let track_id of all_tracks_id) {
            //console.log(songs_map.get(track_id).name);
            nodes.push({
                label: songs_map.get(track_id).name,
                r: 5,
                pos: current_i,
                color: songs_map.get(track_id).playlist_color
            });
            current_i += 1;
        }

        return nodes

    }

    function main() {

        const data = {
            nodes: build_nodes(),
            links: []
        };

        set_graph_size();

        console.log(data.nodes);

        draw_tracks(data);
        //draw_artists();
    }

    function set_graph_size() {
        width = document.querySelector("#graph-artists").clientWidth;
        height = document.querySelector("#graph-artists").clientHeight;

        margin = {top: 0, left: 0, bottom: 0, right: 0};

        chartWidth = width - (margin.left + margin.right);
        chartHeight = height - (margin.top + margin.bottom);

        svg.attr("width", width).attr("height", height)
        //TODO: Add back zoom
            //.call(d3.zoom().on("zoom", function () {svg.attr("transform", d3.event.transform)}));

        chartLayer
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("transform", "translate(" + [margin.left, margin.top] + ")")
    }

    function draw_tracks(data) {
        const simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id(d => d.index))
            .force("collide", d3.forceCollide(d => d.r + 8).iterations(16))
            .force('center', d3.forceCenter(chartWidth/2, chartHeight/2))
            //.force("charge", d3.forceManyBody())
            .force("y", d3.forceY(d => compute_coordinates(d.pos, all_tracks_id.length).y))
            .force("x", d3.forceX(d => compute_coordinates(d.pos, all_tracks_id.length).x));

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
            .enter().append("g");

        var circles = node.append("circle")
            .attr("r", d => d.r)
            .attr("fill", d =>color(d.color));

        var labels = node.append("text")
            .text(function(d) {
                return d.label;
            })
            .attr("fill", d =>color(d.color))
            .attr('x', 10)
            .attr('y', 10);

        /*

        const node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", d => d.r)
            .style("fill", d =>  color(d.color))

        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return "Test" });


         */

        const ticked = function () {

            node
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })

            /*

            node.attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });


             */
        };

        simulation.nodes(data.nodes).on('tick', ticked)
    }






}()); // TODO: Remove ()