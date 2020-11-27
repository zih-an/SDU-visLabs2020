/* Squarified Treemaps */

#include <GLFW/glfw3.h>
#include<vector>
#include<iostream>
#include<algorithm>
#define _WIDTH 800.f  // width of window
#define _HEIGHT 600.f  // height of window
#define WIDTH 600.f  // width of space
#define HEIGHT 400.f  // height of space
#define INF 0x3f3f3f
using namespace std;

// placed areas
vector<double> areas = { 60000,60000,40000,30000,20000,20000,10000 };


struct Color {
	double r, g, b;
	Color() { }
	Color(double x, double y, double z)
		:r(x), g(y), b(z) { }
} YELLOW(1, 1, 0), RED(1, 0, 0), BLACK(0.3, 0.3, 0.3);

struct Rectangle {
	double x1, y1, x2, y2, x3, y3, x4, y4;
	Rectangle(){ }
	Rectangle(double a, double b, double c, double d, double e, double f, double g, double h)
		:x1(a), y1(b), x2(c), y2(d), x3(e), y3(f), x4(g), y4(h) { }
};
vector<Rectangle> rects;
double Rwidth = WIDTH, Rheight = HEIGHT;  // remaining subrectangle: Rwidth->width; Rheight->height;
bool DONE = false;

// transform the coordinates -> opengl coordinates
double transx(double xpos) {
	return (xpos - _WIDTH / 2) / _WIDTH * 2;
}
double transy(double ypos) {
	return (_HEIGHT / 2 - ypos) / _HEIGHT * 2;
}

// display
void display(Color c1 = RED, Color c2 = YELLOW) {

	for (Rectangle rect : rects) {
		// fill in color
		glLineWidth(3);
		glBegin(GL_POLYGON);
		glColor3f(c2.r, c2.g, c2.b);
		glVertex2f(rect.x1, rect.y1);
		glVertex2f(rect.x2, rect.y2);
		glVertex2f(rect.x3, rect.y3);
		glVertex2f(rect.x4, rect.y4);
		glEnd();

		// draw the border
		glBegin(GL_LINE_LOOP);
		glColor3f(c1.r, c1.g, c1.b);
		glVertex2f(rect.x1, rect.y1);
		glVertex2f(rect.x2, rect.y2);
		glVertex2f(rect.x3, rect.y3);
		glVertex2f(rect.x4, rect.y4);
		glEnd();
	}
}

// output/display
void layoutrow(vector<double> R, double w) {
	double lx = WIDTH - Rwidth + (_WIDTH-WIDTH)/2., 
		ly = HEIGHT - Rheight + (_HEIGHT - HEIGHT) / 2.;  // left-top
	
	int direction;  // 0: horizontal;  1: vertical

	// refresh Rwidth, Rheight
	double sum = 0;
	for (auto r : R)
		sum += r;
	double ext = sum / w;
	if (abs(w - Rwidth) <= 1e-6) {
		Rheight -= ext;
		direction = 0;
	}
	else {
		Rwidth -= ext;
		direction = 1;
	}

	// store
	for (auto r : R) {
		if (direction == 0) {
			double hh = ext, ww = r / ext;
			rects.emplace_back(
				transx(lx), transy(ly),
				transx(lx+ww), transy(ly),
				transx(lx+ww), transy(ly+hh),
				transx(lx), transy(ly+hh)
			);
			// refresh
			lx += ww;
		}
		else {
			double ww = ext, hh = r / ext;
			rects.emplace_back(
				transx(lx), transy(ly),
				transx(lx + ww), transy(ly),
				transx(lx + ww), transy(ly + hh),
				transx(lx), transy(ly + hh)
			);
			// refresh
			ly += hh;
		}
	}
	
}

// gives the length of the shortest side of the remaining subrectangle
double width(vector<double> R, int w) {
	// in layoutrow: Rwidth, Rheight have been refresh;
	return min(Rwidth, Rheight);
}

/* gives the highest aspect ratio of a list of rectangles
 * given the length of the side along which they are to be laid out.
 */
double worst(vector<double> R, double w) {
	if (R.empty()) return INF;
	double rmx = 0, rmn = INF, s = 0;
	for (auto r : R) {
		s += r;
		if (r > rmx) rmx = r;
		if (r < rmn) rmn = r;
	}
	double pw = pow(w, 2), sw = pow(s, 2);
	double res = max(pw*rmx / sw, sw / (pw*rmn));
	return max(pw*rmx / sw, sw / (pw*rmn));
}

// algorithm 
void squarify(vector<double> children, vector<double> row, double w) {
	if (w <= 0) return;
	if (children.empty()) {
		if(!row.empty()) layoutrow(row, w);  // output current row
		return;
	}

	// 
	double c = children[0];
	vector<double> newrow = row;  // newrow
	newrow.push_back(c);

	if (worst(row, w) >= worst(newrow, w)) {  // can be placed in this row
		//cout << " add: " << c << endl;
		vector<double> tmp(children.begin() + 1, children.end());
		squarify(tmp, newrow, w);
	}
	else {  // placed in a empty new row
		cout << " new: " << c << endl;
		layoutrow(row, w);  // output current row
		squarify(children, {}, width(row, w));
	}
}


int main(void)
{
	GLFWwindow* window;

	/* Initialize the library */
	if (!glfwInit())
		return -1;

	/* Create a windowed mode window and its OpenGL context */
	window = glfwCreateWindow(_WIDTH, _HEIGHT, "Squarified Treemaps", NULL, NULL);
	glfwSetWindowPos(window, 600, 200);
	if (!window)
	{
		glfwTerminate();
		return -1;
	}

	/* Make the window's context current */
	glfwMakeContextCurrent(window);

	/* Loop until the user closes the window */
	while (!glfwWindowShouldClose(window))
	{
		/* Render here */
		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);
		
		// compute here
		if (!DONE) {
			squarify(areas, {}, min(Rwidth, Rheight));
			DONE = true;
		}
		// display here
		display();


		/* Swap front and back buffers */
		glfwSwapBuffers(window);

		/* Poll for and process events */
		glfwPollEvents();
	}

	glfwTerminate();
	return 0;
}

