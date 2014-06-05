from project_module import project_object, image_object, link_object, challenge_object

p = project_object('tricolor', 'Tricolor')
p.domain = 'http://www.aidansean.com/'
p.path = 'tricolor'
p.preview_image_ = image_object('http://placekitten.com.s3.amazonaws.com/homepage-samples/408/287.jpg', 408, 287)
p.github_repo_name = 'tricolor'
p.mathjax = True
p.links.append(link_object(p.domain, 'tricolor', 'Live page'))
p.introduction = 'While investigating Conway\'s game of life I wanted to see if I could easily extend the framework I\'d developed to explore other systems.  One of the more interesting cellular automata is the rock-paper-scissors system where three populations feed on each other.'
p.overview = '''The algorithm used to make the rock-paper-scissors cellular automata is does not seem to be well documented in an easy to obtain source, so I had to interpet much of the algorithm based on subjective descriptions.  Each cells has a health which can take a value between \(0\) and \(10\).  If a prey species is adjacent to its predator species then the prey species gives a health point to the predator species.  When the prey species health reaches \(0\) it is replaced by a predator species.  The result is that this creates spiral patterns on the canvas.'''

p.challenges.append(challenge_object('The algorithm needed some experimentation and tweaking to get right.', 'There are numerous papers and articles about how these algorithms work, but I couldn\'t find a source that was explicit or that I could understand.  As a result I had to create my own algorithm and tweak it until it was stable.  Hopefully others users can read my code and develop it further.', 'Resolved'))
