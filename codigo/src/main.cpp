#include <iostream>
#include <vector>
#include <string.h>
#include <string>

struct Coord{
    int x;
    int y;
};

typedef std::vector<std::vector<int>> Grid;

void showGrid(Grid grid, int num_row, int num_col);
class Veiculo{
    std::string name;
    int speed;
    public:
        Veiculo(std::string name, int speed){
            this->name = name; 
            this->speed = speed;  
        }

        void setVelocity(int _spd){spd =_spd; }
        void moveAt(Grid &grid, Coord cord){
            grid[cord.x][cord.y] = 1;
        }
        void moveFrom(Grid &grid, Coord start, Coord end){
            for(size_t x = start.x; x < end.x; x++){
                grid[start.y][x] = 3;
                for(size_t y = start.y; y < end.y; y++){
                    grid[x][y] = 1;
                }
            }

        }
    private:
        int spd =0; 
};


int main(){
    Veiculo a = Veiculo("a", 1);
    Grid grid;
    for(int i = 0; i < 30; i++){
        std::vector<int> row;
        for(int j= 0; j < 30; j++){
            row.push_back(0);
        }
        grid.push_back(row);

    }    
    Coord start;
    start.x = 0;
    start.y = 0;
    Coord end;
    end.x = 10;
    end.y = 0;

    a.moveFrom(grid, start, end);
    showGrid(grid, 30, 30);
    return 0;
}

void showGrid(Grid grid, int num_row, int num_col){
    for(int i= 0; i < num_row; i++){
        for(int j = 0; j < num_col; j++){
            std::cout << grid[i][j];
        }
        std::cout << "\n";

    }
}